@ui @HealthCheck @AutomationPractice
Feature: E-commerce Web Application Health Check

Background: Navigation to the URL
  Given User navigated to home page url

@UrlValidation @smoke
Scenario: User opened browser and navigate to home page url and validate the home page url with user given url
And  User navigated to home page url
Then User should be redirected to correct url

@Filters @smoke @regression
Scenario: Check the Search and filter works correctly on Homepage
   Given User sorts the produclist alphabetically
   Then User should be able to see the result alphabetically
   When User keeps the price slider max to 50
   Then All the listed product should be below or equal to 50
   When User searches for "Hammer" in Application
   Then Homepage should display product with matching name "Hammer"
   When User selects a category in Homepage
   Then User should be able to see the related product "tools.powerTools.tools"