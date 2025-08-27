#!/usr/bin/env node

module.exports = function(context) {
    const fs = require('fs');
    const path = require('path');

    console.log('Running after_plugin_add hook');

    const projectRoot = context.opts.projectRoot;

    const podfilePath = path.join(projectRoot, 'platforms', 'ios', 'Podfile');
    if (fs.existsSync(podfilePath)) {
        let podfileContent = fs.readFileSync(podfilePath, 'utf8');
        if (!podfileContent.includes("pod 'SnowplowTracker'")) {
            podfileContent += "\npod 'SnowplowTracker', '~> 6.2.2'\n";
            fs.writeFileSync(podfilePath, podfileContent, 'utf8');
            console.log('Added SnowplowTracker to Podfile');
        }
    }
};