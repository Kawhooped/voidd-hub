# VOID Model Browser

A static browser-based discovery and download interface for public Hugging Face model repositories.

## Features
- Search the public model catalog by name.
- Filter by task and sort by downloads, likes, or recent updates.
- Inspect repository metadata and individual files.
- Identify common weight formats (GGUF, ONNX, Safetensors, PyTorch, TFLite).
- Filter file lists and download selected files directly from Hugging Face.
- Queue multiple files for sequential downloads with per-file progress where supported.
- Display file sizes when supplied by Hub metadata.

## Run
Deploy this folder as a static site. No backend, API key, or account is required for public model discovery.

## Download behavior
Downloads use the original Hugging Face `resolve/main/<file>` URLs. Where supported, the app streams response chunks into a user-selected file handle instead of buffering a multi-gigabyte model in memory. Unsupported browsers use ordinary browser downloads. The app deliberately downloads individual files rather than attempting to fetch an entire repository into browser memory.

Public model metadata is discoverable without authentication. Gated/private repositories may require the user to sign in to Hugging Face and accept access terms. This static page does not collect or store Hugging Face access tokens.

## Limitations
- Streaming progress and direct-to-file saving require browser support for the File System Access API; otherwise the app falls back to normal browser downloads, which may not expose progress.
- Queue items run sequentially. The queue is currently held in the page session and is not persisted after closing the tab.
- Model size filters are approximate and depend on size metadata returned by the Hub.
- Repository licenses and hardware compatibility must be checked on the model card before use.
- Search depends on Hugging Face availability and browser connectivity.

## Source
- Hugging Face Hub API: https://huggingface.co/docs/huggingface_hub
- Model file downloads: https://huggingface.co/docs/huggingface_hub/en/package_reference/file_download
