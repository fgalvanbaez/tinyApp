/**
 * Created by FranciscoAlexis on 02/06/2015.
 */



var app = {
    /*
     Application constructor
     */
    initialize: function() {
        this.bindEvents();
        console.log("Starting NFC Reader app");
    },

    /*
     bind any events that are required on startup to listeners:
     */
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    /*
     this runs when the device is ready for user interaction:
     */
    onDeviceReady: function() {

        /*nfc.addTagDiscoveredListener(
            app.onNfc,             // tag successfully scanned
            function (status) {    // listener successfully initialized
                app.display("Tap a tag to read its id number.");
            },
            function (error) {     // listener fails to initialize
                app.display("NFC reader failed to initialize " +
                JSON.stringify(error));
            }
        );*/
        nfc.addMimeTypeListener(
            "text/plain",
            app.onNfc,             // tag successfully scanned
            function (status) {    // listener successfully initialized
                app.display("Tap a tag to read its id number.");
            },
            function (error) {     // listener fails to initialize
                app.display("NFC reader failed to initialize " +
                JSON.stringify(error));
            }
        );
    },

    /*
     displays tag ID from @nfcEvent in message div:
     */
    onNfc: function(nfcEvent) {
        app.clear();
         //app.display("Event type: " + nfcEvent.type);
         app.showTag(nfcEvent.tag);
    },

    showTag: function(tag) {
      // display the tag properties:
      //app.display("Tag ID: " + nfc.bytesToHexString(tag.id));
      //app.display("Tag Type: " +  tag.type);
      //app.display("Max Size: " +  tag.maxSize + " bytes");
      //app.display("Is Writable: " +  tag.isWritable);
      //app.display("Can Make Read Only: " +  tag.canMakeReadOnly);

      // if there is an NDEF message on the tag, display it:
      var thisMessage = tag.ndefMessage;
      if (thisMessage !== null) {
         // get and display the NDEF record count:
         //app.display("Tag has NDEF message with " + thisMessage.length
            //+ " record" + (thisMessage.length === 1 ? ".":"s."));

         //app.display("Message Contents: ");
         app.showMessage(thisMessage);
      }
   },
     showMessage: function(message) {
      for (var thisRecord in message) {
         // get the next record in the message array:
         var record = message[thisRecord];
         document.getElementById("idMote").value=nfc.bytesToString(record.payload);
         app.showRecord(record);          // show it
      }
   },
   
   showRecord: function(record) {
      // display the TNF, Type, and ID:
      app.display(" ");
      //app.display("TNF: " + record.tnf);
      //app.display("Type: " +  nfc.bytesToString(record.type));
      //app.display("ID: " + nfc.bytesToString(record.id));

      // if the payload is a Smart Poster, it's an NDEF message.
      // read it and display it (recursion is your friend here):
      if (nfc.bytesToString(record.type) === "Sp") {
         var ndefMessage = ndef.decodeMessage(record.payload);
         app.showMessage(ndefMessage);

      // if the payload's not a Smart Poster, display it:
      } else {
         var prueba = nfc.bytesToString(record.payload);
         prueba = prueba[prueba.length-1];
         document.getElementById("idMote").value=prueba; 
         //app.display("Payload: " + nfc.bytesToString(record.payload));
      }
   },
    /*
     appends @message to the message div:
     */
    display: function(message) {
        var label = document.createTextNode(message),
            lineBreak = document.createElement("br");
        messageDiv.appendChild(lineBreak);         // add a line break
        messageDiv.appendChild(label);        // add the text
    },
    /*
     clears the message div:
     */
    clear: function() {
        messageDiv.innerHTML = "";
    }

};     // end of app
