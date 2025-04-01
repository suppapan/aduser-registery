
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const BackendInfo = () => {
  return (
    <Alert className="mb-6 border-brand-200 bg-brand-50">
      <Info className="h-5 w-5 text-brand-600" />
      <AlertTitle className="text-brand-800">Flask Backend Integration</AlertTitle>
      <AlertDescription className="text-brand-700">
        <p className="mb-2">This form is configured to work with a Flask backend that uses PyAD (Python Active Directory) for user creation.</p>
        <p className="mb-2">Make sure your Flask server is running at <code className="bg-white px-1.5 py-0.5 rounded text-sm">http://localhost:5000</code> or update the API_URL in the form component.</p>
        <p>You can implement the Flask backend with the following structure:</p>
        <pre className="bg-white p-3 rounded-md mt-2 text-xs overflow-x-auto">
          {`from flask import Flask, request, jsonify
from flask_cors import CORS
import pyad.aduser  # Python Active Directory module

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/create-ad-user', methods=['POST'])
def create_ad_user():
    data = request.json
    try:
        # Create the user in Active Directory
        new_user = pyad.aduser.ADUser.create(
            name=f"{data['firstName']} {data['lastName']}",
            firstname=data['firstName'],
            lastname=data['lastName'],
            username=data['username'],
            password=data['password'],
            email=data['email'],
            ou=data['ou'],
            telephone=data['telephone'],
            zipcode=data['zipCode'],
            description=data['description'],
            department=data['department'],
            title=data['jobTitle'],
            # Add other attributes based on your AD schema
        )
        
        return jsonify({
            "success": True,
            "message": "User created successfully",
            "user_id": new_user.guid
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)`}
        </pre>
      </AlertDescription>
    </Alert>
  );
};

export default BackendInfo;
