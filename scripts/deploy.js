//imports
const { ethers , run, network} = require("hardhat")



//async func
async function main(){
 const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
 console.log("Deploying Contract in 3 2 1 ...")
 const simpleStorage= await SimpleStorageFactory.deploy()
  await simpleStorage.deployed()
  console.log(`Deployed Contract to: ${simpleStorage.address}`)
  console.log(network.config)
  if(network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY){
    await simpleStorage.deployTransaction.wait(6)
    await verify(simpleStorage.address, [])
  }

  const currentValue = await simpleStorage.retrieve();
  console.log(`Current Age is :${currentValue}`);

  const transactionResponse= await simpleStorage.store(17); //updating the value
  
  await transactionResponse.wait(1);
  const updatedValue = await simpleStorage.retrieve()
  console.log(`Updated Age is : ${updatedValue}`)


}
async function verify(contractAddress, args) {
  console.log("Verifying Contract ...")
  try {
  await run("verify:verify", {
    address: contractAddress,
    ConstructorArguments: args,
  })
} catch(e){
  if (e.mesage.toLowerCase().includes("slready verified")){
    console.log("Already Verified!")
  }else{
    console.log(e)
  }
}
}


//main
main().then(() => process.exit(0))
      .catch((error) => {
         console.error(error)
         process.exit(1);
    });

