import 'dotenv/config';
import Fastfy from 'fastify';
import fastifyjwt from '@fastify/jwt';
import { userRoutes } from './modules/users/user.routes';
import { authRoutes } from './modules/auth/auth.routes';
import { clientRoutes } from './modules/clients/client.routes';
import { leadRoutes } from './modules/leads/leads.routes';
import { taskRoutes } from './modules/tasks/tasks.routes';
import { noteRoutes } from './modules/notes/notes.routes';
import { dashboardRoutes } from './modules/dashboard/dashboard.routes';

export const app = Fastfy({
    logger: true,
});

app.register(fastifyjwt, { secret: process.env.JWT_SECRET!, });
app.register(userRoutes, { prefix: '/user' });
app.register(clientRoutes);
app.register(leadRoutes);
app.register(taskRoutes);
app.register(authRoutes, { prefix: '/auth' });
app.register(noteRoutes);
app.register(dashboardRoutes);


app.get('/health', async () => {
    return { status: 'ok'};
});
