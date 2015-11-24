Feature: How Equal Am I?
    A form which takes the user's gender and country and displays gender equality results personal to them.

    Status:         Embargoed until 10pm on the 18th November - but allowed to use dummy data
    Due live date:  18th Nov 2015
    Promotional:    19th Nov 2015
    Languages:      Lots! Complicated ones include Russian, Chinese, Persian, Arabic

    Things to bear in mind:
      * All of the infographic elements should be "chosen gender" on the left, opposite gender on the right (subject to dev time)
      * RTL flips the following things:
        - ranking (Country Ranking section)
        - risers/fallers (Country Ranking section)
        - the table (at the end of the interactive)
      * There is no personalised share landing page, i.e. clicking on a link someone has shared on social media will load the default landing page, not showing any personalised results

# -------------------------------------------------------------------------------------------

  Scenario: Landing page animation
    When I first land on the page
    Then I should see an animation of people on scales
    When I scale down to mobile
    Then some people should be removed from the animation

  Scenario: Landing page form
    When I first land on the page
    Then I should see a text input field where I can select my country
    And it should be prepopulated with a country (according to the BBC site language)
    And there should be a radio button for each gender
    And a submit button

  #  @TODO - question around synonyms? a) do we support them and b) do we add a scenario for them?

  Scenario: Form interaction
    Given I have filled in my country and selected a gender
    When I submit the 'How equal am I?' button
    Then the results section should load
    And the browser should scroll down to the beginning of the results section

# -------------------------------------------------------------------------------------------

  Scenario Outline: Country Ranking section
    Given I am on the 'country ranking' section
    Then I should see the blocks beneath the humans grow from 0 to the correct height
    And I should see my country's flag
    And if my country's ranking is in the range '< min >' to '< max >'
    Then I should see the following message: '< message >'
    And I should see a ranking and risers/fallers section (which is identical regardless of my chosen country or gender)

    Examples:
    | min | max | message                                                                                 |
    | 1   | 28  | Your country is among the most gender equal countries in the world. It ranks X/145      |
    | 29  | 57  | The gender gap in your country is relatively small compared with others. It ranks X/145 |
    | 58  | 86  | The gender gap in your country is about average compared with others. It ranks X/145    |
    | 87  | 115 | The gender gap in your country is relatively large compared with others. It ranks X/145 |
    | 116 | 145 | Your country is among the bottom ranking countries on gender equality. It ranks X/145   |

  Scenario: Sharing from the Country Ranking section
    Given I am on the 'country ranking' section
    When I try to share from that section
    Then the share message should be a message tailored to my country's level of gender equality

# -------------------------------------------------------------------------------------------

  Scenario: Wages section
    Given I am on the 'wages' section
    Then I should see my country's flag
    And I should see a message with my country's currency (dollar by default)
    And I should see 100 grey dots for both male and female
    @and-if-we-have-time
    Then the dots should become coloured in as an animation proportionally

  Scenario: Sharing from the Wages section
    Given I am on the 'wages' section
    When I try to share from that section
    Then the share message should be a message (personalised to my gender) with my country's currency

# -------------------------------------------------------------------------------------------

  Scenario: Graduates section
    Given I am on the 'graduates' section
    Then I should see an illustration of a male and a female student
    And I should see "X% of university graduates are {MY GENDER}"
    And it should be accompanied by a horizontal bar showing the two gender proportions
    @and-if-we-have-time
    But the percentage should start at '1%' and tick up to the correct percentage
    And the bar should animate from left to right at the same time as the percentage ticker

  Scenario: Sharing from the Graduates section
    Given I am on the 'graduates' section
    When I try to share from that section
    Then the share message should be a message about the percentage of university graduates that are '{MY GENDER}'

# -------------------------------------------------------------------------------------------

  Scenario: Work section
    Given I am on the 'work' section
    Then I should see two vertical bar charts showing the proportion of men and women in work
    And the charts should be accompanied by a percentage
    @and-if-we-have-time
    But the percentage and bar should start at '1%' and animate up

  Scenario: Sharing from the Work section
    Given I am on the 'work' section
    When I try to share from that section
    Then the share message should be about the proportion of '{MY GENDER}' that is in work

# -------------------------------------------------------------------------------------------

  Scenario Outline: Senior Employee section
    Given I am on the 'senior employee' section
    Then I should see what percentage of men and women are senior employees
    And if women make up '< %_of_women >' percent
    Then I should see images matching this description: '< description >'
    And I should see one of the following headings (depending on my gender): '< message_if_female >', '< message_if_male >'
    @and-if-we-have-time
    And the percentage should start at '1%' and tick up to the correct percentage

    Examples:
    | %_of_women  | description              | message_if_female                                                            | message_if_male                                                              |
    | <= 10       | there is just one woman  | Fewer than one in ten senior officials, managers and legislators are female. | Almost all senior officials, managers and legislators are male.              |
    | >= 11 <= 15 | there is just one woman  | Around one in ten senior officials, managers and legislators are female.     | Around nine in ten senior officials, managers and legislators are male.      |
    | >= 16 <= 24 | there is just one woman  | Around one in five senior officials, managers and legislators are female.    | Around four in five senior officials, managers and legislators are male.     |
    | >= 25 <= 34 | there are just two women | Around three in ten senior officials, managers and legislators are female.   | Around seven in ten senior officials, managers and legislators are male.     |
    | >= 35 <= 44 | there are 3 women        | Around two in five senior officials, managers and legislators are female.    | Around three in five senior officials, managers and legislators are male.    |
    | >= 45 <= 50 | women are equal to men   | Almost half of senior officials, managers and legislators are female.        | Around half of all senior officials, managers and legislators are male.      |
    | > 50        | women outnumber men      | There are more female than male senior officials, managers and legislators.  | There are fewer male than female senior officials, managers and legislators. |

  Scenario: Sharing from the Senior Employee section
    Given I am on the 'senior employee' section
    When I try to share from that section
    Then the share message should be about the proportion of '{MY GENDER}' that are senior employees

# -------------------------------------------------------------------------------------------

  Scenario Outline: Government Ministers section
    Given I am on the 'government ministers' section
    Then I should see what percentage of government ministers are '{MY GENDER}'
    And if women make up '< percentage_who_are_women >' percent
    Then I should see an illustration containing '< num_of_women >' women
    @and-if-we-have-time
    But the percentage should start at '1%' and tick up to the correct percentage

    Examples:
    | percentage_who_are_women | num_of_women |
    | < 10                     | 0            |
    | >= 10 < 30               | 1            |
    | >= 30 < 50               | 2            |
    | >= 50                    | 3            |

  Scenario: Sharing from the Government Ministers section
    Given I am on the 'government ministers' section
    When I try to share from that section
    Then the share message should be about the proportion of '{MY GENDER}' that are government ministers

# -------------------------------------------------------------------------------------------

  Scenario: Global Summary Graphic section
    Given I am on the 'global summary graphic section'
    Then I should see the year when the gender gap will close throughout the world

  Scenario: Sharing from the CGlobal Summary Graphic section
    Given I am on the 'global summary graphic section'
    When I try to share from that section
    Then the share message should be about the year when the gender gap will close throughout the world
