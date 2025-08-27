#!/usr/bin/env node

module.exports = function(context) {
    const fs = require('fs');
    const path = require('path');
    const { execSync } = require('child_process');

    console.log('Running after_plugin_add hook');

    const projectRoot = context.opts.projectRoot;
    const iosDir = path.join(projectRoot, 'platforms', 'ios');
    const podfilePath = path.join(iosDir, 'Podfile');

    if (!fs.existsSync(iosDir)) {
        console.log('iOS platform not found. Adding iOS platform...');
        try {
            execSync('cordova platform add ios', { cwd: projectRoot, stdio: 'inherit' });
            console.log('iOS platform added successfully');
        } catch (err) {
            console.error('Error adding iOS platform:', err);
            return;
        }
    }

    if (fs.existsSync(podfilePath)) {
        let podfileContent = fs.readFileSync(podfilePath, 'utf8');
        if (!podfileContent.includes("pod 'SnowplowTracker'")) {
            podfileContent += "\npod 'SnowplowTracker', '~> 6.2.2'\n";
            fs.writeFileSync(podfilePath, podfileContent, 'utf8');
            console.log('Added SnowplowTracker to Podfile');
        } else {
            console.log('SnowplowTracker already exists in Podfile');
        }

        try {
            console.log('Running pod install...');
            execSync('pod install', { cwd: iosDir, stdio: 'inherit' });
            console.log('pod install done');
        } catch (err) {
            console.error('Error running pod install:', err);
        }
    } else {
        console.log('Podfile not found. Skipping pod install.');
    }
};