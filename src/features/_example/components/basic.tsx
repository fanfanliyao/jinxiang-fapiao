import React from 'react'

function ExampleBasic() {
  const [count, setCount] = React.useState(0)

  return (
    <div>
      <div className='card'>
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </div>
  )
}

export default ExampleBasic
