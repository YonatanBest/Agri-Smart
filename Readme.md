
## ⚙️ Backend Setup (FastAPI + Poetry)

> *For backend contributors only*

---

### 📂 Project Structure

```

root/
├── frontend/
├── backend/
│   ├── src/
│   ├── tests/
│   ├── pyproject.toml
│   ├── poetry.lock
├── README.md

````

Backend code and dependencies live in the `backend/` folder.

---

### 1. Install Poetry (if needed)

Install Poetry following the official guide:  
[https://python-poetry.org/docs/#installation](https://python-poetry.org/docs/#installation)

Verify:

```bash
poetry --version
````

---

### 2. Setup Virtual Environment & Install Dependencies

Navigate to backend:

```bash
cd backend
```

**Option A: Let Poetry manage the virtual environment automatically**

```bash
poetry install
poetry shell
```
---

### 3. Run the Server

With the environment active, run:

```bash
uvicorn src.main:app --reload
```

Visit: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

### Quick Tips

* Add a dependency: `poetry add package-name`
* Run a script: `poetry run python script.py`
* Exit shell: `exit`

---

You're ready to start contributing!

```
