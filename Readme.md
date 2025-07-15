
---

## ⚙️ Backend Setup (FastAPI + Poetry)

> *For backend contributors only*

---

### 🛠️ Install Poetry (If Not Installed)

Make sure you have [Poetry](https://python-poetry.org/) installed.
Follow the official installation guide here:
👉 [https://python-poetry.org/docs/#installation](https://python-poetry.org/docs/#installation)

---

### 📁 Go to the Directory

```bash
cd backend
```

---

### 📥 1. Install Dependencies

```bash
poetry install
```

This will:

* Create a virtual environment
* Install everything from `pyproject.toml`

---

### 🧪 2. Activate the Environment

```bash
poetry shell
```

---

### 🚀 3. Run the Server

```bash
uvicorn src.main:app --reload
```

Visit:

* Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

### 💡 Quick Tips

* Add a dependency:
  `poetry add package-name`

* Run a script:
  `poetry run python your_script.py`

* Exit the shell:
  `exit`

---

