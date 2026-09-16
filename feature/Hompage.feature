@ui @HealthCheck @AutomationPractice
Feature: E-commerce Web Application Health Check

Background: Navigation to the URL
  Given User navigated to home page url

@UrlValidation @smoke
Scenario: User opened browser and navigate to home page url and validate the home page url with user given url
And  User navigated to home page url
Then User should be redirected to "process.env.Base_URL" url