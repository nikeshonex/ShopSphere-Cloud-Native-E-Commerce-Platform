# 🛒 ShopSphere — Cloud-Native E-Commerce Platform

A cloud-native e-commerce platform demonstrating modern **containerization, Kubernetes deployment, AWS infrastructure, CI/CD automation, and GitOps practices**.

The application consists of a React frontend and Node.js/Express backend. Both applications are containerized using Docker, stored in Amazon ECR, deployed to Amazon EKS, exposed through an AWS Application Load Balancer, and continuously deployed using GitHub Actions and Argo CD.

---

## 📌 Project Overview

ShopSphere demonstrates an end-to-end cloud-native deployment workflow:

```text
Developer
    │
    │ git push
    ▼
GitHub Repository
    │
    ▼
GitHub Actions
    │
    ├── Build Backend Docker Image
    ├── Build Frontend Docker Image
    ├── Push Images to Amazon ECR
    └── Update GitOps Repository
             │
             ▼
       GitOps Repository
             │
             ▼
           Argo CD
             │
             ▼
        Amazon EKS
        ┌────┴────┐
        │         │
        ▼         ▼
    Frontend   Backend
      Pods       Pods
        │         │
        └────┬────┘
             ▼
       AWS ALB
             │
             ▼
          Internet
````

---

# 🏗️ Architecture

```text
                         Internet
                            |
                            v
                +----------------------+
                |       AWS ALB        |
                |  Internet-facing     |
                +----------+-----------+
                           |
                 +---------+---------+
                 |                   |
              "/" path           "/api/*"
                 |                   |
                 v                   v
        +----------------+   +----------------+
        | Frontend SVC   |   | Backend SVC    |
        | ClusterIP :80  |   | ClusterIP :5000|
        +-------+--------+   +-------+--------+
                |                    |
                v                    v
        Frontend Pods         Backend Pods
        React / Nginx         Node / Express
                                   |
                                   v
                              /api/health
```

---

# 🚀 Technologies Used

## Frontend

- React
- JavaScript
- HTML
- CSS
- Nginx

## Backend

- Node.js
- Express.js
- CORS

## Containerization

- Docker
- Dockerfiles
- Docker images

## AWS

- Amazon EKS
- Amazon ECR
- AWS Application Load Balancer
- AWS IAM
- IAM OIDC
- AWS Load Balancer Controller

## CI/CD

- GitHub Actions
- GitHub OIDC
- Amazon ECR
- kubectl

## GitOps

- Argo CD
- Kubernetes manifests
- Git repository as the desired state

---

# 📂 Project Structure

```text
ShopSphere-Cloud-Native-E-Commerce-Platform/
│
├── backend/
│   ├── Dockerfile
│   ├── index.js
│   ├── package.json
│   └── ...
│
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   │   └── App.js
│   └── ...
│
├── k8s/
│   ├── namespace.yaml
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── shopsphere-ingress.yaml
│   └── aws-load-balancer-controller-sa.yaml
│
├── gitops/
│   └── shopsphere/
│       ├── backend-deployment.yaml
│       ├── backend-service.yaml
│       ├── frontend-deployment.yaml
│       ├── frontend-service.yaml
│       ├── namespace.yaml
│       └── shopsphere-ingress.yaml
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── docker-compose.yaml
│
└── README.md
```

---

# 🔄 Application Flow

The browser communicates with the application through the AWS Application Load Balancer.

### Frontend request

```text
Browser
   |
   | GET /
   v
AWS ALB
   |
   v
Frontend Service
   |
   v
Frontend Pod
```

### Backend request

The frontend does **not** call:

```text
http://localhost:5000
```

Instead, it calls:

```javascript
fetch("/api/health")
```

The request flow is:

```text
Browser
   |
   | /api/health
   v
AWS ALB
   |
   | /api/*
   v
Backend Service :5000
   |
   v
Backend Pod
   |
   v
Express /api/health
```

Backend response:

```json
{
  "status": "UP"
}
```

---

# 🐳 Docker

Both frontend and backend applications are containerized.

## Backend

Build the backend image:

```bash
docker build -t shopsphere-backend ./backend
```

Run locally:

```bash
docker run -p 5000:5000 shopsphere-backend
```

Test:

```bash
curl http://localhost:5000/api/health
```

Expected:

```json
{
  "status": "UP"
}
```

---

## Frontend

Build:

```bash
docker build -t shopsphere-frontend ./frontend
```

Run:

```bash
docker run -p 8080:80 shopsphere-frontend
```

Open:

```text
http://localhost:8080
```

---

# ☁️ Amazon ECR

The Docker images are stored in Amazon Elastic Container Registry.

Repositories:

```text
shopsphere-backend
shopsphere-frontend
```

Example image:

```text
584860297058.dkr.ecr.us-east-1.amazonaws.com/shopsphere-backend:<IMAGE_TAG>
```

Authenticate Docker with ECR:

```bash
aws ecr get-login-password \
  --region us-east-1 \
  | docker login \
  --username AWS \
  --password-stdin \
  584860297058.dkr.ecr.us-east-1.amazonaws.com
```

---

# ☸️ Amazon EKS

The applications run inside an Amazon EKS cluster.

Namespace:

```text
shopsphere
```

Check the cluster:

```bash
kubectl get nodes
```

Check namespace:

```bash
kubectl get namespace shopsphere
```

Check deployments:

```bash
kubectl get deployments -n shopsphere
```

Check pods:

```bash
kubectl get pods -n shopsphere
```

Expected:

```text
shopsphere-backend-xxxxx
shopsphere-frontend-xxxxx
```

---

# 🔌 Kubernetes Services

The frontend and backend use Kubernetes `ClusterIP` services.

## Backend

```text
Service: shopsphere-backend
Port: 5000
Type: ClusterIP
```

## Frontend

```text
Service: shopsphere-frontend
Port: 80
Type: ClusterIP
```

The services are intentionally not public LoadBalancers.

The AWS ALB is the public entry point.

Check services:

```bash
kubectl get services -n shopsphere
```

---

# ⚖️ AWS Application Load Balancer

The AWS Load Balancer Controller manages the ALB.

Ingress:

```text
k8s/shopsphere-ingress.yaml
```

The routing configuration is:

```text
/       → shopsphere-frontend:80

/api    → shopsphere-backend:5000
```

Check ingress:

```bash
kubectl get ingress -n shopsphere
```

Get ALB DNS:

```bash
kubectl get ingress shopsphere-ingress \
  -n shopsphere
```

The ALB provides the public URL for the application.

---

# ❤️ Health Check

Backend endpoint:

```text
/api/health
```

Response:

```json
{
  "status": "UP"
}
```

Test from inside Kubernetes:

```bash
kubectl run curl-test \
  -n shopsphere \
  --rm \
  -it \
  --image=curlimages/curl \
  --restart=Never \
  -- curl http://shopsphere-backend:5000/api/health
```

Expected:

```json
{"status":"UP"}
```

Test through the ALB:

```bash
curl http://<ALB-DNS>/api/health
```

Expected:

```json
{"status":"UP"}
```

---

# 🔐 IAM and GitHub OIDC

GitHub Actions authenticates with AWS using **OIDC federation**.

No long-lived AWS access keys are stored in GitHub.

The workflow requests a temporary AWS role using:

```text
sts:AssumeRoleWithWebIdentity
```

GitHub OIDC provider:

```text
token.actions.githubusercontent.com
```

The GitHub Actions IAM role:

```text
ShopSphere-GitHubActions-Role
```

This role allows the workflow to access the AWS resources required by the deployment pipeline.

---

# 🔄 GitHub Actions CI/CD

Workflow file:

```text
.github/workflows/deploy.yml
```

The pipeline runs when code is pushed to:

```text
main
```

Workflow:

```text
Git Push
   |
   v
GitHub Actions
   |
   +-------------------+
   |                   |
   v                   v
Build Backend      Build Frontend
Docker Image       Docker Image
   |                   |
   v                   v
Push to ECR        Push to ECR
   |                   |
   +---------+---------+
             |
             v
       Configure AWS
             |
             v
        Configure kubectl
             |
             v
       Deploy to EKS
             |
             v
      Verify deployment
```

---

# 📦 GitHub Actions Workflow

The CI/CD pipeline performs the following:

### 1. Checkout source code

```yaml
uses: actions/checkout@v6
```

### 2. Authenticate to AWS

```yaml
uses: aws-actions/configure-aws-credentials@v5
```

### 3. Login to ECR

```yaml
uses: aws-actions/amazon-ecr-login@v2
```

### 4. Build backend

```bash
docker build ./backend
```

### 5. Push backend

```bash
docker push
```

### 6. Build frontend

```bash
docker build ./frontend
```

### 7. Push frontend

```bash
docker push
```

### 8. Configure Kubernetes

```bash
aws eks update-kubeconfig
```

### 9. Deploy backend

```bash
kubectl apply
kubectl set image
```

### 10. Deploy frontend

```bash
kubectl apply
kubectl set image
```

### 11. Deploy ingress

```bash
kubectl apply
```

### 12. Verify rollout

```bash
kubectl rollout status
```

---

# 🌿 GitOps with Argo CD

Argo CD provides continuous deployment using Git as the desired state.

GitOps manifests are stored under:

```text
gitops/shopsphere/
```

Example:

```text
gitops/
└── shopsphere/
    ├── backend-deployment.yaml
    ├── backend-service.yaml
    ├── frontend-deployment.yaml
    ├── frontend-service.yaml
    ├── namespace.yaml
    └── shopsphere-ingress.yaml
```

Argo CD monitors the Git repository.

The flow is:

```text
Git Repository
      |
      | Desired state
      v
    Argo CD
      |
      | Sync
      v
    Amazon EKS
      |
      v
Kubernetes Resources
```

---

# 🔎 Argo CD Verification

Check Argo CD:

```bash
kubectl get pods -n argocd
```

Check the ShopSphere application:

```bash
kubectl get application shopsphere -n argocd
```

Expected:

```text
NAME          SYNC STATUS   HEALTH STATUS
shopsphere    Synced        Healthy
```

You can also watch synchronization:

```bash
kubectl get application shopsphere \
  -n argocd \
  -w
```

---

# 🔁 GitOps Deployment Example

When a new application version is available:

```text
Developer
   |
   | git push
   v
GitHub
   |
   v
GitHub Actions
   |
   v
Docker Image
   |
   v
Amazon ECR
   |
   v
GitOps Manifest
   |
   v
Argo CD
   |
   v
Amazon EKS
```

Argo CD continuously compares:

```text
Git desired state
       vs
Kubernetes live state
```

If they differ:

```text
OutOfSync
```

After synchronization:

```text
Synced
```

---

# 🧪 End-to-End Testing

## 1. Check EKS nodes

```bash
kubectl get nodes
```

All nodes should be:

```text
Ready
```

---

## 2. Check application pods

```bash
kubectl get pods -n shopsphere
```

Expected:

```text
Running
```

---

## 3. Check services

```bash
kubectl get svc -n shopsphere
```

---

## 4. Check ingress

```bash
kubectl get ingress -n shopsphere
```

---

## 5. Check TargetGroupBindings

```bash
kubectl get targetgroupbindings -n shopsphere
```

---

## 6. Test backend internally

```bash
kubectl run curl-test \
  -n shopsphere \
  --rm \
  -it \
  --image=curlimages/curl \
  --restart=Never \
  -- curl http://shopsphere-backend:5000/api/health
```

Expected:

```json
{"status":"UP"}
```

---

## 7. Test backend through ALB

```bash
curl http://<ALB-DNS>/api/health
```

Expected:

```json
{"status":"UP"}
```

---

## 8. Test frontend

Open:

```text
http://<ALB-DNS>/
```

Expected:

```text
ShopSphere CI/CD
Cloud-Native E-Commerce Platform

Frontend: ONLINE
Backend: UP

🚀 Deployed automatically using GitHub Actions
```

---

# 🛠️ Troubleshooting

## Pods are not running

Check:

```bash
kubectl get pods -n shopsphere
```

Then:

```bash
kubectl describe pod <POD-NAME> -n shopsphere
```

Check logs:

```bash
kubectl logs <POD-NAME> -n shopsphere
```

---

## Backend health check fails

Check backend pods:

```bash
kubectl get pods \
  -n shopsphere \
  -l app=shopsphere-backend
```

Check service:

```bash
kubectl get svc shopsphere-backend \
  -n shopsphere
```

Test internally:

```bash
kubectl run curl-test \
  -n shopsphere \
  --rm \
  -it \
  --image=curlimages/curl \
  --restart=Never \
  -- curl http://shopsphere-backend:5000/api/health
```

---

## Frontend shows Backend DOWN

Check `frontend/src/App.js`.

The frontend should call:

```javascript
fetch("/api/health")
```

Do not use:

```javascript
fetch("http://localhost:5000/health")
```

After changing the frontend:

```text
Build Docker image
       ↓
Push image to ECR
       ↓
Update GitOps manifest
       ↓
Argo CD sync
       ↓
EKS rollout
```

---

## ALB does not appear

Check:

```bash
kubectl get ingress -n shopsphere
```

Describe it:

```bash
kubectl describe ingress \
  shopsphere-ingress \
  -n shopsphere
```

Check AWS Load Balancer Controller:

```bash
kubectl get deployment \
  aws-load-balancer-controller \
  -n kube-system
```

Check logs:

```bash
kubectl logs \
  -n kube-system \
  deployment/aws-load-balancer-controller \
  --tail=50
```

---

## Argo CD shows OutOfSync

Check:

```bash
kubectl get application shopsphere \
  -n argocd
```

Describe:

```bash
kubectl describe application shopsphere \
  -n argocd
```

You can manually sync from the Argo CD UI or CLI.

---

## GitHub Actions AWS authentication fails

Check that the GitHub OIDC provider exists:

```bash
aws iam list-open-id-connect-providers
```

Expected provider:

```text
token.actions.githubusercontent.com
```

Check the IAM role:

```bash
aws iam get-role \
  --role-name ShopSphere-GitHubActions-Role
```

The trust policy must allow:

```text
sts:AssumeRoleWithWebIdentity
```

and must restrict the GitHub repository/branch appropriately.

---

# 🔐 Security Design

The project uses GitHub OIDC instead of storing permanent AWS access keys in GitHub.

Benefits:

- No long-lived AWS access keys
- Temporary AWS credentials
- IAM role-based permissions
- GitHub repository restrictions
- AWS-side authentication control

The Kubernetes frontend and backend services are also kept as:

```text
ClusterIP
```

rather than exposing each service directly to the Internet.

The ALB is the public entry point.

---

# 📈 Deployment Strategy

Kubernetes Deployments are used to manage application replicas.

Example:

```yaml
replicas: 3
```

Kubernetes maintains the desired number of pods.

During an image update:

```text
Old Pods
   │
   ├── Running
   ├── Running
   └── Running
          ↓
      New Image
          ↓
   Rolling Update
          ↓
New Pods
   │
   ├── Running
   ├── Running
   └── Running
```

This provides controlled application updates without manually recreating the entire application.

---

# 📊 Observability and Verification

Useful Kubernetes commands:

```bash
kubectl get nodes
```

```bash
kubectl get pods -n shopsphere
```

```bash
kubectl get deployments -n shopsphere
```

```bash
kubectl get services -n shopsphere
```

```bash
kubectl get ingress -n shopsphere
```

```bash
kubectl get targetgroupbindings -n shopsphere
```

```bash
kubectl get application shopsphere -n argocd
```

---

# 🧹 Useful Cleanup Commands

Delete ShopSphere application resources:

```bash
kubectl delete namespace shopsphere
```

Delete Argo CD application:

```bash
kubectl delete application shopsphere -n argocd
```

> Be careful with these commands because they delete Kubernetes resources.

---

# 🎯 Project Objectives

This project demonstrates the following practical DevOps and cloud-native skills:

- Containerizing applications with Docker
- Creating Docker images
- Publishing images to Amazon ECR
- Deploying applications to Amazon EKS
- Creating Kubernetes Deployments
- Creating Kubernetes Services
- Configuring AWS Application Load Balancer
- Configuring AWS Load Balancer Controller
- Using IAM and OIDC
- Implementing GitHub Actions CI/CD
- Using GitHub OIDC for AWS authentication
- Implementing GitOps with Argo CD
- Performing rolling Kubernetes deployments
- Monitoring application health
- Troubleshooting Kubernetes deployments

---

# 🏆 Final Architecture

```text
                         ┌───────────────────┐
                         │     Developer     │
                         └─────────┬─────────┘
                                   │
                              git push
                                   │
                                   ▼
                         ┌───────────────────┐
                         │      GitHub       │
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │  GitHub Actions   │
                         │                   │
                         │ Docker Build      │
                         │ ECR Push          │
                         │ Deployment        │
                         └─────────┬─────────┘
                                   │
                  ┌────────────────┴────────────────┐
                  │                                 │
                  ▼                                 ▼
        ┌───────────────────┐             ┌───────────────────┐
        │    Amazon ECR     │             │   GitOps Repo     │
        │                   │             │                   │
        │ Backend Image     │             │ Kubernetes YAML   │
        │ Frontend Image    │             │ manifests         │
        └───────────────────┘             └─────────┬─────────┘
                                                    │
                                                    ▼
                                           ┌───────────────────┐
                                           │      Argo CD      │
                                           │                   │
                                           │ GitOps Controller │
                                           └─────────┬─────────┘
                                                     │
                                                     ▼
                                           ┌───────────────────┐
                                           │    Amazon EKS     │
                                           │                   │
                                           │ ┌───────────────┐ │
                                           │ │   Frontend    │ │
                                           │ │     Pods      │ │
                                           │ └───────────────┘ │
                                           │                   │
                                           │ ┌───────────────┐ │
                                           │ │    Backend    │ │
                                           │ │     Pods      │ │
                                           │ └───────────────┘ │
                                           └─────────┬─────────┘
                                                     │
                                                     ▼
                                           ┌───────────────────┐
                                           │      AWS ALB      │
                                           │                   │
                                           │ /      → Frontend │
                                           │ /api/* → Backend  │
                                           └─────────┬─────────┘
                                                     │
                                                     ▼
                                                 Browser
