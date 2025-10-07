"use client";

import React from "react";
import Section from "@/components/common/Section";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  eventDetails: z.string().min(10, "Please provide some details about your event."),
  message: z.string().optional(),
});

const Booking: React.FC = () => {
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            eventDetails: "",
            message: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        toast({
            title: "Booking Inquiry Sent!",
            description: "We've received your request and will get back to you shortly.",
        });
        form.reset();
    }

  return (
    <Section id="booking" title="Booking Inquiries">
      <div className="max-w-2xl mx-auto">
        <Card className="border-white/10 bg-secondary/30 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Book Rhythmic Canvas</CardTitle>
                <CardDescription>Fill out the form below to inquire about a booking.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="you@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="eventDetails"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Event Details</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Corporate event, Wedding, Festival" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Additional Message (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Tell us more about your event..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full accent-glow">Submit Inquiry</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
      </div>
    </Section>
  );
};

export default Booking;
