import React, { createContext, useState } from "react";
import "driver.js/dist/driver.css";
import { driver } from "driver.js";

export const DriveContext = createContext();

export default function DriverProvider({ children }) {
    const [isDrive, setIdDrive] = useState(false);

    const toggleDriver = () => {
        setIdDrive(!isDrive);
    };
    const driverObj = driver({
        popoverClass:'driverjs-theme',
        showButtons:['next'],
        steps: [
            { popover: { title: 'Welcome to our website!', description: "Let's take a good look around" } },
            { element: '.step0', popover: { title: "Home page", description: 'You can navigate to home page!', side: "left", align: 'start' }},
            { element: '.step1', popover: { title: "Here's the diamond check", description: 'you can search the diamond had been valuated', side: "left", align: 'start' }},
            { element: '.step2', popover: { title: "Here's valuation page", description: 'You can calculate based on available fields', side: "bottom", align: 'start' }},
            { element: '.step3', popover: { title: 'This is the price page', description: 'You can view all of the available price showed in marketplace ', side: "bottom", align: 'start' }},
            { element: '.step4', popover: { title: 'This is the education page', description: 'You can absorb diamond knowledge', side: "left", align: 'start' }},
            { element: '.step5', popover: { title: 'The dashboard page', description: 'You can click to view your dashboard about pending request, payment method, valuated diamond, and so on!', side: "top", align: 'start' }},
            { element: '.step6', popover: { title: 'Thank you😊', description: 'Enjoy your valuating diamond time at our website! 🙌', side: "right", align: 'start' }},
        ]
    });

    const value = {
        toggleDriver,
        driverObj,
    };

    return (
        <DriveContext.Provider value={value}>{children}</DriveContext.Provider>
    );
}
