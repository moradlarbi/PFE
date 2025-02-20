import type React from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jan", North: 4000, South: 2400, East: 2400, West: 3200 },
  { name: "Feb", North: 3000, South: 1398, East: 2210, West: 3000 },
  { name: "Mar", North: 2000, South: 9800, East: 2290, West: 3500 },
  { name: "Apr", North: 2780, South: 3908, East: 2000, West: 3100 },
  { name: "May", North: 1890, South: 4800, East: 2181, West: 3400 },
  { name: "Jun", North: 2390, South: 3800, East: 2500, West: 3200 },
]

const WastePredictionChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="North" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="South" stroke="#82ca9d" />
        <Line type="monotone" dataKey="East" stroke="#ffc658" />
        <Line type="monotone" dataKey="West" stroke="#ff7300" />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default WastePredictionChart

