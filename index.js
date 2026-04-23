import express from 'express';
import mongoose from 'mongoose';
 
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

const itemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number
});

const Item = mongoose.model('Item', itemSchema);

// fetch all items
app.get('/login', (req, res) => {
  res.send('Hello World, this is my first mongoose app!');
});

app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "failed to fetch items" });
  }
});



// create a new item
app.post('/items', async (req, res) => {
  const item = new Item({
    name: req.body.name,
    price: req.body.price,
    quantity: req.body.quantity
  });

  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: "failed to create item" });
  }
});


//update an item
app.put('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const updateditem = await Item.findByIdAndUpdate(id, req.body, { new: true });

    if (!updateditem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(updateditem);

  } catch (err) {
    res.status(400).json({ message: "failed to update item" });
  }
});



// delete an item
app.delete('/items/:id', async (req, res) => {
    try{
  const { id } = req.params;
  const deletedItem = await Item.findByIdAndDelete(id);
  if (!deletedItem) {
    return res.status(404).json({ message: 'Item not found' });
  }
  res.json({ message: 'Item deleted successfully', item: deletedItem });
} catch (err) {
    res.status(400).json({ message: "failed to delete item" });
}
});



app.listen(5000, () => {
  console.log('Server is running on port 5000');
}); 