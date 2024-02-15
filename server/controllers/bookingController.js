const getMentorAvailability = async (req, res) => {
  let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mentorEmail: req.body.email,
      date: req.body.date,
      time: req.body.time,
      studentEmail: req.user.email
    })
  }
  let response = await fetch('http://localhost:3000/mentor/availability', options);
  let data = await response.json();
  if (data.error) {
    return res.json({ error: data.error })
  } else {
    if (data.availability) {
      return res.json({ result: 'Mentor is available' })
    } else {
      return res.json({ error: 'Mentor is not available' })
    }
  }
}
