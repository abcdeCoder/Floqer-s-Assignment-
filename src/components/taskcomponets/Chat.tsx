import React, { useState } from 'react';
import groq from './groqClient'; // Import the configured Groq client
import jobsData from '../../data/salaries.json';  // Import your job data
import './chats.css'
// Define the Job interface
interface Job {
    work_year: string | number;
    salary_in_usd: number;
    job_title: string;
}

// Define the Message interface
interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const preprocessData = () => {
    const aggregatedData: { [year: string]: { totalJobs: number, averageSalary: number, jobTitles: { [title: string]: number } } } = {};

    (jobsData as Job[]).forEach((job) => {
        if (!aggregatedData[job.work_year]) {
            aggregatedData[job.work_year] = { totalJobs: 0, averageSalary: 0, jobTitles: {} };
        }

        aggregatedData[job.work_year].totalJobs += 1;
        aggregatedData[job.work_year].averageSalary += job.salary_in_usd;

        if (!aggregatedData[job.work_year].jobTitles[job.job_title]) {
            aggregatedData[job.work_year].jobTitles[job.job_title] = 0;
        }

        aggregatedData[job.work_year].jobTitles[job.job_title] += 1;
    });

    for (const year in aggregatedData) {
        aggregatedData[year].averageSalary /= aggregatedData[year].totalJobs;
    }

    return aggregatedData;
};

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');

    const handleSend = async () => {
        if (input.trim() === '') return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages([...messages, userMessage]);
        setInput('');

        try {
            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    { role: 'user', content: input },
                    {
                        role: 'system',
                        content: `You are an assistant that helps users analyze job market data. Here's the aggregated data you should use for reference: ${JSON.stringify(preprocessData())}`
                    }
                ],
                model: 'llama3-8b-8192'  // Use the appropriate model
            });

            const assistantMessage: Message = {
                role: 'assistant',
                content: chatCompletion.choices[0]?.message?.content || '',
            };

            setMessages([...messages, userMessage, assistantMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="flex flex-col h-screen max-w-3xl mx-auto border rounded-lg overflow-hidden">
            <div className="flex-1 p-4 overflow-y-auto fi">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-3 my-2 rounded-md ${msg.role === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-gray-900 self-start'}`}
                    >
                        {msg.content}
                    </div>
                ))}
            </div>
            <div className="flex p-4 border-t">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-1 p-2 border rounded-md sty"
                />
                <button onClick={handleSend} className="ml-4 p-2 bg-blue-500 text-white rounded-md">Send</button>
            </div>
        </div>
    );
};

export default Chat;
