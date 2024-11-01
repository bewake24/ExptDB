### Getting validation error directly in MONGOOSE_VALIDATION_ERROR from pre(save) hook
```js
router.post("/adduser", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    res.status(200).json({ message: "User added successfully...", data: user });
  } catch (err) {
    if (err.code === MONGOOSE_DUPLICATE_KEY) {
      return res.status(400).json({ message: "User already exists..." });
    }

    if (
      err.name === MONGOOSE_VALIDATION_ERROR
    ) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: err });
  }
});
```