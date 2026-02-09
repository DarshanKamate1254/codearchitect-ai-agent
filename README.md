# 🤖 LOVELY CODER – Agentic AI Software Engineer

**LOVELY CODER** is an end-to-end **Agentic AI system** that behaves like an automated software engineer. Inspired by tools such as Devin AI and Lovable, it converts a simple natural-language prompt into a **fully functional, multi-file software project**.

You describe *what* you want to build — Coder Buddy figures out *how* to build it.

## ✨ What Coder Does

Given a prompt like:

```bash
python main.py "Create a responsive calculator web application"
```

Coder will:

1. Plan the application features and tech stack  
2. Design the project architecture and file structure  
3. Generate clean, working source code (HTML, CSS, JS, etc.)  
4. Iteratively refine the code until the project is complete  

All generated files are written automatically to your local filesystem.

---

## 🚀 Key Features

- **Agentic Planning**  
  Converts vague prompts into structured engineering plans and Jira-style feature stories.

- **Architectural Reasoning**  
  Acts like a senior software architect by defining detailed implementation steps for every file.

- **Iterative Code Generation**  
  Uses a ReAct-style agent loop to read, write, and refine code until completion.

- **Tool-Enabled AI**  
  The agent can interact with the filesystem using controlled read/write tools.

- **Visual Agent Debugging**  
  Supports tracing LangGraph execution and agent state using an Agentic Debugger.

- **Schema-Driven Outputs**  
  Pydantic models enforce structured, production-grade outputs.

---

## 🧠 Agent Architecture

Coder Buddy is implemented using **LangGraph** with three core agent nodes:

### 1️⃣ Planner Agent
- Interprets the user prompt
- Defines:
  - Features
  - Tech stack
  - File structure
- Outputs a high-level engineering plan

### 2️⃣ Architect Agent
- Converts plans into detailed, file-level implementation instructions
- Acts like a senior engineer guiding development

### 3️⃣ Coder Agent
- Implements instructions
- Iteratively writes and refines code
- Continues until project status is marked `done`

<div style="text-align: center;">
    <img src="resources/coder_buddy_diagram.png" alt="Coder Agent Architecture" width="90%"/>
</div>

---

## 🛠️ Tech Stack

| Category | Technology |
|--------|------------|
| Agent Framework | LangChain, LangGraph |
| LLM Inference | Open-source GPT models via Groq Cloud |
| Language | Python |
| Package Manager | UV |
| Debugging | AI Agentic Debugger |
| Validation | Pydantic |

---

## ▶️ Usage

```bash
python main.py "build a SIMPLE and COMPOUND INTEREST calculator web app with local storage"
```
## ▶️ Example Outputs:

![Architecture](app1.jpg)
![Architecture](app2.jpg)
---
## ⚠️ Disclaimer
This project is for educational and experimental use only.
## 👨‍💻 Developer Info
**Name:** Manjunath C Bagewadi  
**Email:** manjunathsept11@gmail.com  
**Phone:** +91 97428 96702  
**Porfolio:** www.manjunathbagewadi.in  
**LinkedIn:** [linkedin.com/in/manjunath-bagewadi-9325ab55](https://www.linkedin.com/in/manjunath-bagewadi-9325ab55)

