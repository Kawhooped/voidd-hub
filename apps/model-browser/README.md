# VOID Model Browser

A static browser-based discovery and download interface for public Hugging Face model repositories.

## Features
- Search the public model catalog by name.
- Filter by task and sort by downloads, likes, or recent updates.
- Inspect repository metadata and individual files.
- Identify common weight formats (GGUF, ONNX, Safetensors, PyTorch, TFLite).
- Filter file lists and download selected files directly from Hugging Face.
- Display file sizes when supplied by Hub metadata.

## Run
Deploy this folder as a static site. No backend, API key, or account is required for public model discovery.

## Download behavior
Downloads are initiated through the original Hugging Face `resolve/main/<file>` URLs. The browser controls the destination and download behavior. The app deliberately downloads individual files rather than attempting to fetch an entire repository into browser memory.

Public model metadata is discoverable without authentication. Gated/private repositories may require the user to sign in to Hugging Face and accept access terms. This static page does not collect or store Hugging Face access tokens.

## Limitations
- Browser downloads may not provide a reliable aggregate progress bar for large files.
- Multi-file repositories are downloaded one file at a time.
- Model size filters are approximate and depend on size metadata returned by the Hub.
- Repository licenses and hardware compatibility must be checked on the model card before use.
- Search depends on Hugging Face availability and browser connectivity.

## Source
- Hugging Face Hub API: https://huggingface.co/docs/huggingface_hub
- Model file downloads: https://huggingface.co/docs/huggingface_hub/en/package_reference/file_download
