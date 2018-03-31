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
  pair: any;
  account: any;

  constructor(private http: HttpClient) {
    StellarSdk.Network.useTestNetwork();
    this.server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
    
    this.running = false;
  }

  private createAccount() {
    this.running = true;
    
    var isaacToken = new StellarSdk.Asset(this.ISAAC_ASSET_NAME, this.ISAAC_ISSUING_ACCOUNT);
    
    // Local variables to avoid scrope issues
    var pair = StellarSdk.Keypair.random();
    var server = this.server;
    
    this.pair = pair;
	
    this.http.get('https://friendbot.stellar.org?addr='+ pair.publicKey())
      .subscribe((data) => {
        console.log(data);
      
        server.loadAccount(pair.publicKey()).then(function(account) {
          console.log('Received details for account: '+ pair.publicKey());
          this.account = account;
          
          account.balances.forEach(function(balance) {
            console.log('Type:', balance.asset_type, ', Balance:', balance.balance);
          });
          
          // Generate trust transaction
          var transaction = new StellarSdk.TransactionBuilder(account)
            .addOperation(StellarSdk.Operation.changeTrust({
              asset: isaacToken
            }))
            .build();
          
          transaction.sign(pair);
          
          console.log('Submitting trust transaction...');
          
          return server.submitTransaction(transaction);
        })
        .then(function() {
          return server.loadAccount(pair.publicKey).then(function(account) {
                console.log('Received details for account after transaction');
                this.account = account;
                
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
