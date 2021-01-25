import mongoose from 'mongoose';
mongoose.connect(process.env.MONGOURI,
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  () => {
      console.log('Connected to DB');
  });

  
  