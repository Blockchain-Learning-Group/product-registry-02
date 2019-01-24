window.getNetwork = function(web3) {
    return new Promise((resolve, reject) => {
        web3.version.getNetwork((err, networkId) => {
            resolve(networkId);
        });
    });
}