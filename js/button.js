const discordButton = document.getElementById('discord-button');
const discordAccount = document.getElementById('discord-name');

discordButton.onclick = function(e) {
    discordAccount.className = 'transition';
}