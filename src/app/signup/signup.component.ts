import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare var StellarSdk: any;

@Component({
  selector: 'app-home',
  templateUrl: './signup.component.html',
  styleUrls: ['signup.component.less']
})
export class SignupComponent {
  
  ISAAC_ASSET_NAME: string = 'ISAAC';
  ISAAC_ISSUING_ACCOUNT: string = 'GD5SQKW4MDDAQDUSW7CVJJCMF5JWBXBY5RN7XYHDR4L6FF2NAU4I7GOQ';
  
  server: any;
  
  running: boolean;
  loadingText: string;
  success: boolean;
  error: string;
  
  pair: any;
  account: any;

  constructor(private http: HttpClient) {
    StellarSdk.Network.useTestNetwork();
    this.server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
    
    this.running = false;
  }

  private createAccount() {
    this.running = true;
	this.loadingText = 'Creating Your Account...';
    
    var isaacToken = new StellarSdk.Asset(this.ISAAC_ASSET_NAME, this.ISAAC_ISSUING_ACCOUNT);
    
    // Local variable to avoid scrope issues
	var self = this;
    self.pair = StellarSdk.Keypair.random();
	
    this.http.get('https://friendbot.stellar.org?addr='+ self.pair.publicKey())
      .subscribe((data) => {
        console.log(data);
      
        self.server.loadAccount(self.pair.publicKey()).then(function(account) {
          console.log('Received details for account: '+ self.pair.publicKey());
          self.account = account;
          
          account.balances.forEach(function(balance) {
            console.log('Type:', balance.asset_type, ', Balance:', balance.balance);
          });
          
          // Generate trust transaction
          var transaction = new StellarSdk.TransactionBuilder(account)
            .addOperation(StellarSdk.Operation.changeTrust({
              asset: isaacToken
            }))
            .build();
          
          transaction.sign(self.pair);
          
		  self.loadingText = 'Generating Trust Transaction...';
          console.log('Submitting trust transaction...');
          
          return self.server.submitTransaction(transaction);
        })
        .then(function(result) {
		  console.log('Trust transaction successful');
		  console.log(result);
		  
          self.server.loadAccount(self.pair.publicKey()).then(function(account) {
			console.log('Received details for account after transaction');
			self.account = account;
			self.success = true;
			self.running = false;
			
			account.balances.forEach(function(balance) {
			  console.log('Type:', balance.asset_type, ', Balance:', balance.balance);
			});
		  });
        })
        .catch(function(error) {
          console.error('Error!', error);
        });
      },
      (err) => {
        
      });
  }
}
