
---

## 📥 Install Dependencies

```bash
poetry install
```

This will:

* Create a virtual environment
* Install everything listed in `pyproject.toml`

---

## 🧪 Step 2: Activate the Virtual Environment

```bash
poetry shell
```

Now you're inside the project’s Python environment. You can run commands like `python`, `uvicorn`, etc.

---

## 🚀 Step 3: Run the Server

Inside the Poetry shell:

```bash
uvicorn main:app --reload
```

Your FastAPI server will be available at:

* Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
* API: [http://127.0.0.1:8000/api/...](http://127.0.0.1:8000/api/...)

---

## 💡 Tips

**Add a new dependency:**

```bash
poetry add package-name
```

**Run any Python file:**

```bash
poetry run python your_script.py
```

**Exit the shell:**

```bash
exit
```

---

