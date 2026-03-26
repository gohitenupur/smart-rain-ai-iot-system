import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function SensorChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="temperature_c" stroke="#ff7300" name="Temp (°C)" />
        <Line type="monotone" dataKey="humidity_pct" stroke="#387908" name="Humidity (%)" />
        <Line type="monotone" dataKey="rain_analog" stroke="#0047ab" name="Rain Analog" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="captured_at" tick={false} />
        <YAxis />
        <Tooltip />
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default SensorChart;
