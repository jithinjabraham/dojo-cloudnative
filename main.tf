terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "3.74.1"
    }
  }
}

# AWS Provider
provider "aws" {
  # Configuration options
  region     = "ap-southeast-2"
  access_key = "AKIASHFUBKMHRGGGTAHU"
  secret_key = "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"
}

resource "aws_ecr_repository" "ecr-repo-1" {
  name = "ecr-repo-1" 
}

resource "aws_ecs_cluster" "demo-cluster" {
  name = "demo-cluster" # Naming the cluster
}