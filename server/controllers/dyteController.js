const { DYTE_ORG_ID, DYTE_API_KEY } = require('../config')
const { supabase } = require('../utility/dbConnection')

const createWebinar = async (req, res) => {
  const data = { "title": req.body.title, "preferred_region": "ap-south-1", "record_on_start": false, "live_stream_on_start": false, "recording_config": { "max_seconds": 60, "file_name_prefix": "string", "video_config": { "codec": "H264", "width": 1280, "height": 720, "watermark": { "url": "http://example.com", "size": { "width": 1, "height": 1 }, "position": "left top" } }, "audio_config": { "codec": "AAC", "channel": "stereo" }, "storage_config": { "type": "aws", "access_key": "string", "secret": "string", "bucket": "string", "region": "us-east-1", "path": "string", "auth_method": "KEY", "username": "string", "password": "string", "host": "string", "port": 0, "private_key": "string" }, "dyte_bucket_config": { "enabled": true }, "live_streaming_config": { "rtmp_url": "rtmp://a.rtmp.youtube.com/live2" } } }
  const concatenatedString = DYTE_ORG_ID + ':' + DYTE_API_KEY
  const webinar = await fetch('https://api.dyte.io/v2/meetings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(concatenatedString).toString('base64')}`
    },
    body: JSON.stringify(data)
  })
  const response = await webinar.json()
  if (!response) {
    return res.json({ error: response.error })
  } else if (response && !response.success) {
    return res.json({ error: response.error })
  } else {
    const { error } = await supabase
      .from('webinar')
      .insert({ title: req.body.title, meeting_link: 'https://api.dyte.io/v2/meetings/' + response.data.id, start_time: req.body.start, end_time: req.body.end, mentor_email: req.user.email })
    if (error) {
      return res.json({ error: error.message })
    }
    return res.json({ success: response.data })
  }
}

const getWebinars = async (req, res) => {
  const { error } = await supabase
    .from('webinar')
    .select('*')
    .eq('mentor_email', req.user.email)
    .eq('validity', true)
  if (error) {
    return res.json({ error: error.message })
  }
  return res.json({ success: data })
}

const getAllWebinars = async (req, res) => {
  const { data, error } = await supabase
    .from('webinar')
    .select('*')
    .eq('validity', true)
  if (error) {
    return res.json({ error: error.message })
  }
  return res.json({ success: data })
}

module.exports = {
  createWebinar,
  getWebinars,
  getAllWebinars
}
