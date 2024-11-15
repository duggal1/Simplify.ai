"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from 'react'
import { useClerk, useUser } from "@clerk/nextjs"
import ModernSidebar from "@/components/SideBar/page"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { JsonConverter } from "@/components/JsonConverter"
import { motion } from "framer-motion"
import { toast } from "sonner"
import Navbar from "@/components/navigation/navbar"
import { DashboardMetrics } from "@/types/metrics"


const DashboardPage = () => {
    const router = useRouter()
    const { signOut } = useClerk()
    const { user, isLoaded } = useUser()
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState<DashboardMetrics>({
        totalProjects: 0,
        activeConversions: 0,
        successfulConversions: 0,
        failedConversions: 0,
        averageProcessingTime: 0,
        totalDataProcessed: 0,
        conversionAccuracy: 0,
        apiUsage: 0,
        userEfficiencyScore: 0,
        overallPerformance: 0,
        averageDataQuality: 0,
        averageOutputQuality: 0,
    })

    useEffect(() => {
        const fetchUserStats = async () => {
            if (!user?.id) return;
            
            try {
                setLoading(true);
                const response = await fetch('/api/metrics');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                setStats({
                    totalProjects: data.totalProjects || 0,
                    activeConversions: data.activeConversions || 0,
                    successfulConversions: data.successfulConversions || 0,
                    failedConversions: data.failedConversions || 0,
                    averageProcessingTime: data.averageProcessingTime || 0,
                    totalDataProcessed: data.totalDataProcessed || 0,
                    conversionAccuracy: data.conversionAccuracy || 0,
                    apiUsage: Math.min(100, ((data.apiUsage || 0) / 10) * 100),
                    userEfficiencyScore: data.userEfficiencyScore || 0,
                    overallPerformance: Math.round(
                        ((data.conversionAccuracy || 0) * 0.4) +
                        ((data.userEfficiencyScore || 0) * 0.3) +
                        ((data.averageCompressionRatio || 0) * 0.3)
                    ),
                    averageDataQuality: data.averageDataQuality || 0,
                    averageOutputQuality: data.averageOutputQuality || 0,
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
                toast.error('Failed to load metrics');
            } finally {
                setLoading(false);
            }
        };

        if (isLoaded && user) {
            fetchUserStats();
        }
    }, [user, isLoaded]);

    const handleSignOut = async () => {
        try {
            await signOut()
            router.push('/')
            toast.success('Signed out successfully')
        } catch (error) {
            console.error('Error signing out:', error)
            toast.error('Failed to sign out')
        }
    }

    if (!isLoaded) {
        return <div className="flex justify-center items-center min-h-screen">
            <Skeleton className="rounded-full w-32 h-32" />
        </div>
    }

    if (!user) {
        router.push('/sign-in')
        return null
    }

    return (
        <div className="top-0 z-50 sticky bg-black">
            <Navbar/>
      
            <div className="flex bg-white min-h-screen">
                <ModernSidebar />
            
                <div className="flex-grow bg-white p-8">
                    <div className="mx-auto max-w-7xl">
                        {/* Header Section */}
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8"
                        >
                            <h1 className="bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 font-bold text-6xl text-transparent">
                                Welcome back, {user?.firstName || 'User'}👋🏻🎉!
                            </h1>
                            <p className="mt-2 text-gray-900 dark:text-gray-400">
                                Heres an overview of your activity and conversion tools
                            </p>
                        </motion.div>

                        {/* Stats Section */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="gap-6 grid grid-cols-1 md:grid-cols-4 mb-8"
                        >
                            {loading ? (
                                [...Array(4)].map((_, i) => (
                                    <Card key={i} className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6">
                                        <Skeleton className="mb-2 w-24 h-8" />
                                        <Skeleton className="w-16 h-6" />
                                    </Card>
                                ))
                            ) : (
                                <>
                           

                                    <StatsCard
                                        title="Total Conversions"
                                        value={stats.totalProjects}
                                        gradient="from-blue-500 to-blue-600"
                                    />
                                    <StatsCard
                                        title="Success Rate"
                                        value={`${stats.conversionAccuracy}%`}
                                        gradient="from-green-500 to-green-600"
                                    />
                                    <StatsCard
                                        title="Active Today"
                                        value={stats.activeConversions}
                                        gradient="from-purple-500 to-purple-600"
                                    />
                                    <StatsCard
                                        title="Avg Process Time"
                                        value={`${stats.averageProcessingTime}ms`}
                                        gradient="from-orange-500 to-orange-600"
                                    />
                                    <StatsCard
                                        title="Data Processed"
                                        value={`${stats.totalDataProcessed}KB`}
                                        gradient="from-pink-500 to-pink-600"
                                    />
                                    <StatsCard
                                        title="API Usage"
                                        value={`${stats.apiUsage}%`}
                                        gradient="from-indigo-500 to-indigo-600"
                                    />
                                    <StatsCard
                                        title="Efficiency Score"
                                        value={`${stats.userEfficiencyScore}%`}
                                        gradient="from-teal-500 to-teal-600"
                                    />
                                    <StatsCard
                                        title="Performance"
                                        value={`${stats.overallPerformance}%`}
                                        gradient="from-red-500 to-red-600"
                                    />
                                </>
                            )}
                        </motion.div>

                        {/* JSON Converter Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6">
                                <JsonConverter />
                            </Card>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-wrap gap-4 mt-8"
                        >
                            <Button 
                                onClick={() => router.push("/new-project")}
                                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 hover:from-purple-700 to-blue-600 hover:to-blue-700"
                            >
                                <PlusIcon className="w-4 h-4" />
                                New Project
                            </Button>
                            <Button 
                                onClick={() => router.push("/")} 
                                variant="outline"
                                className="border-2"
                            >
                                Back to Home
                            </Button>
                            <Button 
                                onClick={handleSignOut}
                                variant="destructive"
                                className="bg-gradient-to-r from-red-600 to-red-700"
                            >
                                Sign Out
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </div>

      
        </div>

       
    )
}

const StatsCard = ({ title, value, gradient }: { title: string; value: number | string; gradient: string }) => (
    <Card className="border-2 border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 hover:shadow-lg backdrop-blur-sm p-6 transition-all duration-300">
        <h3 className="font-medium text-gray-600 text-lg dark:text-gray-300">{title}</h3>
        <p className={`text-3xl font-bold mt-2 bg-gradient-to-r ${gradient} text-transparent bg-clip-text`}>
            {value}
        </p>
    </Card>
)

// Plus Icon component remains the same
const PlusIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg 
        className={className} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
    >
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 4v16m8-8H4" 
        />
    </svg>
)

export default DashboardPage