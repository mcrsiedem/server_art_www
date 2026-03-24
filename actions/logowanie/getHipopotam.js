


const getHipopotam = (req, res) => {
  try {
    const io = req.io;
    io.emit("hipopotam", {
      tresc: "OK",
    });
  } catch (err) {
  } finally {
    res.status(201).json("ok");
  }
};

module.exports = {
  getHipopotam
};
