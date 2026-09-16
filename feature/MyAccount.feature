
@ui @myaccount 
Feature: E-commerce Web Application Accont Management

Background: Navigation to the URL
  Given User navigated to home page url

@userLogin @smoke
Scenario: User is able to login with valid credentials and validate the user account page url
Given User clicked on SignIn button
And User entered valid username and password
Then User should be able to see the welcome text "data.myAccount.welcomeText" on the account page