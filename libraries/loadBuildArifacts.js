window.buildArtifacts = {};

window.loadBuildArtifacts = function () {
    // Check if already loaded
    if (Object.keys(window.buildArtifacts).length > 0)
        return;

    let contract;

    return new Promise(async (resolve, reject) => {
        const filePath = '../smart-contracts/build/contracts/';

        // Load the artifacts for all contracts
        $.getJSON(filePath, function(jsonFiles) {
            // Retrieve json data for all files, all async so need to accumulate promises to resolve together
            const jsonPromises = loadBuildArtifactsJSON(filePath, jsonFiles);

            // Resolve all promises to retrieve desired json data
            Promise.all(jsonPromises).then(function(contracts) {
                for (let i = 0; i < contracts.length; i += 1) {
                    contract = contracts[i];
                    window.buildArtifacts[contract.contractName] = { 
                        abi: contract.abi, 
                        networks: contract.networks
                    };
                }
                resolve();
            });
        });
    })
};


function loadBuildArtifactsJSON(filePath, files) {
    let promise;
    const promises = []
    
    for(let i = 0; i < files.length; i +=1) {
        // Do not need the default Migrations contract data
        if (files[i] != 'Migrations.json') {
            promise = new Promise((resolve, reject) => {
                $.getJSON(filePath + files[i], function(data){
                    resolve(data);
                });
            }); 
            
            promises.push(promise);
        }
    }

    return promises;
}

