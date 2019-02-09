resource "google_container_cluster" "rust_react_demo" {
  name = "rust-react-demo"
  zone = "us-central1-a"

  lifecycle {
    ignore_changes = ["node_pool"]
  }

  node_pool {
    name = "default-pool"
  }
}

resource "google_container_node_pool" "node_pool" {
  name       = "node-pool"
  zone       = "us-central1-a"
  cluster    = "${google_container_cluster.rust_react_demo.name}"
  node_count = 1

  node_config {
    preemptible  = true
    machine_type = "n1-standard-1"

    oauth_scopes = [
      "compute-rw",
      "storage-ro",
      "logging-write",
      "monitoring",
    ]
  }
}
