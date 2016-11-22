(function($){
    /*** function to generate an array with different positions
       for the cards that are going to be used in the game ***/
    var boardGenerator = function () {
        var array = [],
            object = {},
            arrayColors = ['green','aqua','pink', 'orange', 'blue', 'red', 'yellow', 'purple',
                'green','aqua','pink', 'orange', 'blue', 'red', 'yellow', 'purple'],
            i = arrayColors.length,
            j = 0;
        while (i--) {
            j = Math.floor(Math.random() * (i+1));
            array.push(arrayColors[j]);
            arrayColors.splice(j,1);
        }
        return array;
    };

    /*** Document ready function ***/
    $(function(){

        var position = 1,
            newBoard = boardGenerator(),
            flipCards = [],
            countFlippedCards = 0,
            rounds = 0,
            points = 0,
            pairsFounded = 0,
            roundsSpan = $('.number-of-rounds'),
            pointsSpan = $('.number-of-points'),
            getPlayersRanking = function () {
              var players = [];
              var trString = '';
              var localStorageData = localStorage;
              for (var i in localStorage) {
                players.push(JSON.parse(localStorage.getItem(i)));
              };
              players.sort(function (a, b) {
                  var aPoint = a.points,
                      bPoint = b.points,
                      aRound = a.rounds,
                      bRound = b.rounds;


                  if(aPoint == bPoint)
                  {
                      return (aRound < bRound) ? -1 : (aRound > bRound) ? 1 : 0;
                  }
                  else
                  {
                      return (aPoint > bPoint) ? -1 : 1;
                  }
              });
              $('.game-over').addClass('hide');
              $('.game-ranking').removeClass('hide');
              for (i=0; i < players.length; i++) {
                  trString += '<tr class="data"><td>' + players[i].name + '</td>';
                  trString += '<td>' + players[i].email + '</td>';
                  trString += '<td>' + players[i].points.toString() + '</td>';
                  trString += '<td>' + players[i].rounds.toString() + '</td></tr>';
                  $('#rankingList').append(trString);
                  trString = '';
              }
            },

            /*** Function to restart the
               Colour Memory game ***/
            restartFunction = function () {
                if (flipCards.length > 0) {
                    for (i=0; i< flipCards.length; i++) {
                        $('.card:nth-of-type(' + flipCards[i].position +')').removeClass(flipCards[i].color).
                            addClass('closed').removeClass('card-opened');
                    }
                }
                for (j=1; j< 17; j++) {
                    $('.card:nth-of-type(' +  j.toString() +')').addClass('closed').
                        removeClass('card-removed').removeClass('card-selected').removeClass('card-opened');
                }

                position = 1;
                newBoard = boardGenerator();
                flipCards = [];
                countFlippedCards = 0;
                rounds = 0;
                points = 0;
                pairsFounded = 0;
                pointsSpan.text(points.toString());
                roundsSpan.text(rounds.toString());
                $('.card').on('mousedown', function () { return false });

                $('.card:nth-of-type(1)').focus();
            };

        /*** Function to use the game only
            with the arrow keys (can focus on
            cards and the restar button ***/
        $(document).on('keydown', function(e) {
            //right
            if (e.keyCode == 39) {
                if(position === 17) {
                    position = 1;
                    $('.card:nth-of-type(' + position.toString() +')').focus();
                } else {
                $   ('.card:nth-of-type(' + position.toString() +')').next().focus();
                    position += 1;
                }
            }
            //left
            if (e.keyCode == 37) {
                if (position === 1) {
                    position = 17;
                    $('.card:nth-of-type(' + position.toString() +')').focus();
                } else {
                    $('.card:nth-of-type(' + position.toString() +')').prev().focus();
                    position -= 1;
               }
            }

            //up
            if ( e.keyCode == 38) {
                switch(position) {
                    case 1:
                        position = 13;
                        break;
                    case 2:
                        position = 14;
                        break;
                    case 3:
                        position = 15;
                        break;
                    case 4:
                        position = 16;
                        break;
                    default:
                        position -= 4;
                }
                $('.card:nth-of-type(' + position.toString() +')').focus();
            }

            //down
            if ( e.keyCode == 40) {
                switch(position) {
                    case 13:
                        position = 1;
                        break;
                    case 14:
                        position = 2;
                        break;
                    case 15:
                        position = 3;
                        break;
                    case 16:
                        position = 4;
                        break;
                    default:
                        position += 4;
                }
                $('.card:nth-of-type(' + position.toString() +')').focus();
            }
        });

        /*** Event handler to avoid mouse clicking ***/
        $('.card').on('mousedown', function() {
            return false;
        });

        /*** Event handlers to highlight cards
            and the restart button ***/
        $('.card').on('focus', function (e) {
            var cardSelected = $(e.currentTarget);
            cardSelected.addClass('card-selected');
        });


        $('.card').on('blur', function (e) {
            var cardSelected = $(e.currentTarget);
            cardSelected.removeClass('card-selected');
        });

        /*** Giving first card the focus ***/
        $('.card:nth-of-type(1)').focus();

        /*** Set points and rounds to 0 zero ***/
        pointsSpan.text(points.toString());
        roundsSpan.text(rounds.toString());

        /*** Event handler for keyup in order
           to catch the enter key in a card
           chose or in the restart button ***/
        $('.card').on('keyup', function (e) {
            var color = newBoard[position - 1],
                target = $(e.currentTarget),
                roundsSpan = $('.number-of-rounds'),
                pointsSpan = $('.number-of-points');

            pointsSpan.text(points.toString());
            roundsSpan.text(rounds.toString());

            if ( e.keyCode === 13 && !target.hasClass('card-removed') && !target.hasClass('restart') && !target.hasClass('card-opened') ) {

                if (countFlippedCards < 1) {

                    $('.card:nth-of-type(' + position.toString() +')').removeClass('closed').addClass(color).addClass('card-opened');
                    countFlippedCards +=1;
                    flipCards.push({ 'color' : color , 'position': position.toString()});

                } else {

                    $('.card:nth-of-type(' + position.toString() +')').removeClass('closed').addClass(color).addClass('card-opened');
                    rounds += 1;
                    roundsSpan.text(rounds.toString());
                    flipCards.push({ 'color' : color , 'position': position.toString()});

                        if (color === flipCards[0].color) {
                              /*** timeout in order to let
                                 the user verify that flipped
                                 cards are equals ***/
                            setTimeout(function (flipCards) {
                                for (j=0; j< 2; j++) {
                                    $('.card:nth-of-type(' + flipCards[j].position +')').removeClass(flipCards[j].color).removeClass('closed').
                                        addClass('card-removed').removeClass('card-selected').removeClass('card-opened');
                                }
                            }, 500, flipCards);

                            points +=1;
                            pointsSpan.text(points.toString());
                            pairsFounded +=1;
                            /*** Condition to show game
                                over window to the user ***/
                            if (pairsFounded === 8) {
                                $('.game-over').removeClass('hide');
                                $('#playerName').focus();

                            }

                        } else {
                            /*** timeout in order to let
                                 the user verify that flipped
                                 cards are not equals ***/
                            setTimeout(function (flipCards) {
                                for (j=0; j< 2; j++) {
                                    $('.card:nth-of-type(' + flipCards[j].position +')').removeClass(flipCards[j].color).addClass('closed').
                                    removeClass('card-opened');
                                }
                            },500, flipCards);

                            /*** not negative points
                                just to 0 zero ***/
                            if (points > 0) {
                                points -=1;
                                pointsSpan.text(points.toString());
                            }
                        }

                    flipCards = [];
                    countFlippedCards = 0;
                }

            /*** if option to enter key
               pressed on restart button ***/
            } else if ( e.keyCode === 13 && target.hasClass('restart') ) {
                /*** Restart opened cards and
                   removed cards ***/
                restartFunction();
            }
        });

        /** function to handle the submit event
            when user ends game and needs to send
            the information of the game***/
        $('#submitPoints').on('click', function () {
            var nameVal = $('#playerName'),
                mailVal = $('#playerMail'),
                errorMessage = $('.error-message'),
                reGexpEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
                isValidEmail = reGexpEmail.test(mailVal.val()),
                errorClass = 'input-error',
                hasError = false,
                data = {};

            //fields validation
            if (nameVal.val() === '') {
                nameVal.addClass(errorClass);
                hasError = true;
            } else {
                nameVal.removeClass(errorClass);
                hasError = false;
            }
            if (!isValidEmail) {
                mailVal.addClass(errorClass);
                hasError = true;
            } else {
                mailVal.removeClass(errorClass);
                hasError = false;
            }

            //Show error message
            if (hasError) {
                errorMessage.removeClass('hide');
                return false;
            } else {
                errorMessage.addClass('hide');
            }

            //data object for request
            data.name = nameVal.val();
            data.email = mailVal.val();
            data.points = points;
            data.rounds = rounds;

            //Cleaning inputs
            nameVal.val('').removeClass(errorClass);
            mailVal.val('').removeClass(errorClass);

            var playersRanking = localStorage.getItem(data.email);
            var existingUserData;

            if (!playersRanking) {
              localStorage.setItem(data.email, JSON.stringify(data));
            } else {
              existingUserData = localStorage.getItem(data.email);
              existingUserData = JSON.parse(existingUserData);
              existingUserData.points = data.points;
              existingUserData.rounds = data.rounds;
              localStorage.setItem(data.email, JSON.stringify(existingUserData));
            }
            getPlayersRanking();

        });

        /*** Function to handle click on
            start new game button on ranking table ***/
        $('#startNewGame').on('click', function () {
            restartFunction();
            $('#rankingList').find('tr.data').remove();
            $('.game-ranking').addClass('hide');
        });

        /*** Avoid form submit event ***/
        $('form').submit(function (evt) {
            evt.preventDefault();
        });
    });
})(jQuery);
