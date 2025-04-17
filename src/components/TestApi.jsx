"use client"

import { useEffect, useState } from "react"

export function TestApi() {
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const testApi = async () => {
            try {
                const response = await fetch('/api/royalty')
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                const result = await response.json()
                setData(result)
            } catch (err) {
                setError(err.message)
                console.error('API Error:', err)
            }
        }

        testApi()
    }, [])

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">API Test Results</h2>
            {error ? (
                <div className="text-red-500">
                    <p>Error: {error}</p>
                </div>
            ) : data ? (
                <pre className="bg-gray-100 p-4 rounded">
                    {JSON.stringify(data, null, 2)}
                </pre>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
} 