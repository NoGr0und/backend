# Rotas

| Metodo | Rota | Auth |
| --- | --- | --- |
| GET | /health | Nao |
| POST | /auth/login | Nao |
| POST | /user | Nao |
| GET | /user | Sim (ADMIN) |
| GET | /me | Sim |
| POST | /clients | Sim |
| GET | /clients | Sim |
| PUT | /clients/:id | Sim |
| DELETE | /clients/:id | Sim |
| POST | /leads | Sim |
| GET | /leads | Sim |
| GET | /clients/:id/leads | Sim |
| PATCH | /leads/:id/status | Sim |
| DELETE | /leads/:id | Sim |
| POST | /tasks | Sim |
| GET | /tasks | Sim |
| GET | /leads/:id/tasks | Sim |
| PATCH | /tasks/:id/done | Sim |
| POST | /notes | Sim |
| GET | /leads/:id/notes | Sim |
| GET | /clients/:id/notes | Sim |
| DELETE | /notes/:id | Sim |
| GET | /dashboard | Sim |
