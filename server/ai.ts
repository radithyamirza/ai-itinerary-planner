"use server";

import { db } from "@/db/drizzle";
import { plans } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { formSchema } from "./schema";

export async function generateTripItinerary(formData: z.infer<typeof formSchema>){
    const { startDate, endDate, budget, activities, destination } = formData;

  let destinationVal = ``;
  if (destination) {
    destinationVal = `to ${destination}.`;
  }

  let prompt = `
    Hi there, I am planning a trip ${destinationVal}
    from ${startDate} to ${endDate} with a budget of ${budget}$. 
    
    I want to do the following activities: ${activities.join(", ")}.

    Could you create the travel itinerary with destination details for me?

    The result should be an HTML list of days with the activities for each day. Please format the result as HTML,
    such as adding unordered list HTML tag for each activity in the day and bold the text for each day title.
  `;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    }),
  });

  const data = await response.json();

  const user = await currentUser();

  const [plan] = await db
    .insert(plans)
    .values({
      text: data.choices[0].message.content,
      userId: user?.id,
      budget,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    })
    .returning();

  return plan.id;
}