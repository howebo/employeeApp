const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/employeeDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Include the Employee model
const Employee = require('./models/employee.model');

app.use(cors());
app.use(bodyParser.json());

// Route to add a new employee
app.post('/api/employees', async (req, res) => {
  try {
    const newEmployee = new Employee(req.body);
    await newEmployee.save();
    res.json(newEmployee);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get all employees
app.get('/api/employees', async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page, default to 1
  const limit = parseInt(req.query.limit) || 10; // Number of employees per page

  try {
    const count = await Employee.countDocuments();
    const totalPages = Math.ceil(count / limit);

    const employees = await Employee.find()
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      employees,
      pagination: {
        currentPage: page,
        totalPages,
        totalEmployees: count,
        employeesPerPage: limit,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to search for an employee by name
app.get('/api/employees/search', async (req, res) => {
  const { name } = req.query;
  try {
    const employees = await Employee.find({ name: { $regex: name, $options: 'i' } });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
