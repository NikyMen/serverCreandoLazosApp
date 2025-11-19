import 'dotenv/config';
import { createApp } from './app.js';
const app = createApp();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(PORT, () => {
    console.log(`API escuchando en http://localhost:${PORT}`);
});
