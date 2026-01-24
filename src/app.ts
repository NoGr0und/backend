import 'dotenv/config';
import Fastfy from 'fastify';
import fastifyjwt from '@fastify/jwt';
import { userRoutes } from './modules/users/user.routes';
import { authRoutes } from './modules/auth/auth.routes';
import { clientRoutes } from './modules/clients/client.routes';


export const app = Fastfy({
    logger: true,
});

app.register(fastifyjwt, { secret: process.env.JWT_SECRET!, });
app.register(userRoutes, { prefix: '/user' });
app.register(clientRoutes);
app.register(authRoutes, { prefix: '/auth' });


app.get('/health', async () => {
    return { status: 'ok'};
});
