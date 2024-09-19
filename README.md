# Bonus Task Report: Using LLMs for Job Market Analysis

## Overview

In this task, we utilized the LLaMA 3-8b-8192 model provided by GROQ to analyze aggregated job market data. The following steps outline the approach taken and the resulting insights.

## Data Aggregation

The data was preprocessed using the following function:

```typescript
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
```
This function aggregates job data by year, calculating the total number of jobs, average salary, and job titles distribution.

## API Interaction
We sent the aggregated data to the GROQ API with a prompt to generate insightful responses:

```typescript
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
```
This function sends the user input along with the preprocessed data to the GROQ model and receives an assistant's response.
## Response
The generated response from the LLaMA model provides insights into the job market data, helping users understand trends and patterns.

Note: The actual response from the model can be included here based on the output received from the API call.

## live link 
link:- https://66ec03a01f336d7e168a0c9b--dainty-queijadas-2cc808.netlify.app/

