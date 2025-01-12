import React from 'react'
import {SignOutButton} from "@clerk/nextjs";

const DashboardPage = () => {
    return (
        <>
            <div>DashboardPage</div>
            <SignOutButton redirectUrl="/">Sign Out</SignOutButton>
        </>

    )
}
export default DashboardPage
