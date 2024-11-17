package com.sunkatsu.backend.models;

public class Owner extends User {
    private String contactInfo;


    public Owner() {
    }

    public Owner(String id, String username, String password, String role, String contactInfo) {
        super(id, username, password, role);
        this.contactInfo = contactInfo;
    }

    public String getContactInfo() {
        return this.contactInfo;
    }

    public void setContactInfo(String contactInfo) {
        this.contactInfo = contactInfo;
    }

    public Owner contactInfo(String contactInfo) {
        setContactInfo(contactInfo);
        return this;
    }
}