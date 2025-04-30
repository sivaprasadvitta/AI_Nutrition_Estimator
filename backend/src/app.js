import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.js';


const app = express();
app.use(express.json());
app.use(cors('*'));
// app.options('*', cors());



const PORT = 3000;


app.use('/api', apiRoutes);


app.listen(PORT, () => console.log(`Server on port ${PORT}`));



