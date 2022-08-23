/*
    Roblox Texture Remover
    Removes your Roblox textures in one click
*/
const fs = require("fs");
const chalk = require("chalk");
const path = require("path");
const readline = require("readline-sync");

/* Checking if Roblox is installed */
const robloxBase = path.resolve(process.env.LOCALAPPDATA, "Roblox", "Versions");
if (!fs.existsSync(robloxBase)) {
    console.log(chalk.red.bold("Cannot detect Roblox installation. Please make sure Roblox is installed and try again."));
    readline.question('Press [ENTER] to exit.', {hideEchoBack: true, mask: ''});
    process.exit();
}

/* Finding the correct Roblox version */
let robloxVersion;
const versions = fs.readdirSync(robloxBase, {
    withFileTypes: true
})
    .filter(e => e.isDirectory())
    .map(e => e.name);
versions.forEach(version => {
    const rVersionPath = path.resolve(robloxBase, version);
    const files = fs.readdirSync(rVersionPath);
    if (files.includes("RobloxPlayerBeta.exe")) {
        robloxVersion = rVersionPath;
    }
});
if (!robloxVersion) {
    console.log(chalk.red.bold("Cannot detect Roblox installation. You might have Roblox Studio installed, but not Roblox. Please make sure Roblox is installed and try again."));
    readline.question('Press [ENTER] to exit.', {hideEchoBack: true, mask: ''});
    process.exit();
}
/* Creating configuration files */
console.log("Creating configuration files...");
const configFolder = path.resolve(robloxVersion, "ClientSettings"); // These are different from the ones you set inside Roblox
if (!fs.existsSync(configFolder)){
    fs.mkdirSync(configFolder);
}
try {
    fs.writeFileSync(path.resolve(configFolder, "ClientAppSettings.json"), JSON.stringify({"FFlagDebugDisableOTAMaterialTexture": "true"}));
} catch {
    console.log(chalk.red.bold("Failed to create configuration files. Please run this program with administrator rights and try again."));
    readline.question('Press [ENTER] to exit.', {hideEchoBack: true, mask: ''});
    process.exit();
}
console.log("Deleting textures..");
const textureFolder = path.resolve(robloxVersion, "PlatformContent", "pc", "textures");
if (!fs.existsSync(textureFolder)) {
    console.log(chalk.red.bold("Could not find textures folder. Your Roblox installation may be corrupted. Try reinstalling, then try again."));
    readline.question('Press [ENTER] to exit.', {hideEchoBack: true, mask: ''});
    process.exit();
}
const texturesToDelete = ["brick", "cobblestone", "concrete", "corrodedmetal", "diamondplate", "fabric", "foil", "granite", "grass", "ice", "marble", "metal", "pebble", "plastic", "sand", "slate", "wood", "woodplanks"];
texturesToDelete.forEach(texture => {
    const texturePath = path.join(textureFolder, texture);
    if (fs.existsSync(texturePath)) {
        fs.rmSync(texturePath, { recursive: true, force: true });
        console.log(`Deleted texture ${texture}`);
    } else {
        console.log(`Skipped deleting texture ${texture} because already deleted.`);
    }
});
console.log(chalk.green.bold("Successfully deleted all textures."));
readline.question('Press [ENTER] to exit.', {hideEchoBack: true, mask: ''});
process.exit();