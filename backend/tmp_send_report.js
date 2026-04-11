require('dotenv').config();
const { sendBroadcastEmail } = require('./src/lib/email');

const report = `
# Kido Farms Admin Portal: Audit & Success Report

**Status:** ✅ COMPLETION PHASE REACHED
**Auditor:** Antigravity AI
**Date:** March 2026

## 🚀 Executive Summary
The Kido Farms Admin Ecosystem has been fully audited and stabilized. All core protocols—from Farmer/Vendor governance to System Vitality and Pulse Broadcasts—are now operational.

## 🛠️ Critical Enhancements & Fixed Issues
- **Global Pulse & Mass Broadcast**: Operational via Admin -> Subscribers.
- **Marketplace & Flash Sales**: Restored visible "Harvest Blitz" banner and badges.
- **Biotic Asset Governance**: Added "Synchronizing..." states and global Sync buttons.
- **Academy Dashboard**: Fixed 404 by creating the management interface.
- **System Vitality**: Real-time telemetry monitoring enabled.

## 📊 Final Page Audit
- /admin: ACTIVE
- /admin/farmers: ACTIVE (Sync Enabled)
- /admin/vendors: ACTIVE (Sync Enabled)
- /admin/sensors: ACTIVE
- /admin/academy: ACTIVE
- /admin/system: ACTIVE
- /shop: ACTIVE (Flash Sales Enabled)

**Report Generated and Sent Successfully.**
Powering the West African Harvest.
`;

const recipients = ['usamaado36@gmail.com', 'vexelvision@gmail.com', 'uszkido@icloud.com'];

console.log('--- Triggering Final Executive Broadcast ---');
sendBroadcastEmail(recipients, "Kido Farms: Admin Portal Development Success Report", report)
    .then(success => {
        if (success) {
            console.log('✅ BROADCAST DISPATCHED TO: ' + recipients.join(', '));
            process.exit(0);
        } else {
            console.error('❌ BROADCAST FAILURE');
            process.exit(1);
        }
    })
    .catch(err => {
        console.error('❌ CRITICAL DISPATCH ERROR:', err);
        process.exit(1);
    });
