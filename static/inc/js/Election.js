(function () {
  const Election = function () {
    /* @type string - introducses username value in the url */
    this.username = localStorage.getItem('username')

    /* @type string - introduces the authtoken value in the url */
    this.authtoken = localStorage.getItem('authtoken')

    /* @type bool - shows if there's an election running */
    this.runningElection = false

    /* @type string - url parameter for disabling Town Hall blocking mode */
    this.ignoretownhall = getURLParameter('ignoretownhall')

    /* @type object - settings for elections pages */
    this.settings = {
      availableCommentPages: ['current']
    }

    /* @type object or array - election data from ajax request */
    this.electionData = []

    /* @type object or array - election data from ajax request */
    this.currentElectionData = {}

    /* @type object or array - vote data from ajax request */
    this.voteData = []

    /* @type object or array - info data from ajax request */
    this.infoData = []

    this.election = this

    /* METHODS */

    /**
         * showing Error messages
         */
    this.showError = function (message, type) {
      if (typeof type === 'undefined') {
        $('.error').css('background-color', '#D4784B')
        variables.showError(message)
      } else if (type === 'success') {
        $('.error').empty().html(message).css('background-color', '#61AF61').fadeIn()
        $('html,body').animate({
          scrollTop: '0'
        }, 'slow')
      }
    }

    this.showElectionProcess = function (electionId) {
      const _that = this

      const showElectionProcess = function (data) {
        const electionTableData = data.ElectionProcess
        const electionProcessInfoTemplate = $.templates('#election-process-table-template')
        const html = electionProcessInfoTemplate.render(electionTableData)

        $('#election-process-modal-table-placeholder').html(html)

        $('#election-process-modal-table-placeholder .flat-table .table-middle:odd').addClass('table-alternating-color-1')
        $('#election-process-modal-table-placeholder .flat-table .table-middle:even').addClass('table-alternating-color-2')

        //
        $('#election-process-modal').modal('toggle')
        // $(".fancy-election-title-contents").fadeIn();
      }

      _that.getElectionById(electionId, showElectionProcess, false)
    }

    this.showElectionActionOnCompleteTable = function (electionId) {
      const _that = this

      const showElectionActionOnCompleteTable = function (data) {
        const electionTableData = data
        const electionProcessInfoTemplate = $.templates('#election-action-on-complete-table-template')
        const html = electionProcessInfoTemplate.render(electionTableData)

        $('#election-action-on-complete-table-wrapper').html(html)
        $('#election-action-on-complete-table-wrapper').show()

        $('#election-action-on-complete-table-wrapper .flat-table .table-middle:odd').addClass('table-alternating-color-1')
        $('#election-action-on-complete-table-wrapper .flat-table .table-middle:even').addClass('table-alternating-color-2')
      }

      _that.getElectionById(electionId, showElectionActionOnCompleteTable, false)
    }

    this.showElectionProcessLink = function (data) {
      const electionProcessInfoTemplate = $.templates('#election-process-link-template')
      const html = electionProcessInfoTemplate.render(data.ElectionProcess)

      $('#election-info-results-wrapper').append(html)
    }

    this.showElectionName = function (data) {
      const electionNameTemplate = $.templates('#election-name-template')
      const html = electionNameTemplate.render(data)

      $('#election-name-wrapper').html(html)
      $('#election-name-wrapper').show()
    }

    /**
         * get all election by type(previous,current)
         */
    this.getElectionById = function (id, callback, update) {
      update = update || false

      const url = APPIQUERYURL + '/api/v1/elections/' + id
      const that = this

      if (Object.keys(that.electionData).length && !update) {
        return callback(that.electionData)
      }

      return $.ajax({
        url,
        type: 'get',
        async: false,
        success (data) {
          for (let i = 0; i < data.Results.ChoiceRanks.length; i++) {
            const item = data.Results.ChoiceRanks[i]
            if (item.VotesPerRound === undefined) {
              item.VotesPerRound = []
            }
            data.Results.ChoiceRanks[i] = item
          }
          // saving election data, because not to do ajax second time
          that.electionData = data
          if (data.Comments.length == 0) {
            $('#graph_composer').remove()
          }
          if (data.Comments) {
            callback(that.electionData)
          }
        }
      })
    }

    // /**
    //  * get current election
    //  */
    // this.getCurrentElection = function (callback, update) {
    //     update = update || false;
    //     let url = APPIQUERYURL + "/api/v1/elections/current",
    //         _this = this;
    //
    //     if (Object.keys(_this.currentElectionData).length && !update) {
    //         callback(_this.currentElectionData);
    //     } else {
    //         $.ajax({
    //             url: url,
    //             type: "get",
    //             async: false,
    //             success: function (data) {
    //                 // saving election data, because not to do ajax second time
    //                 _this.currentElectionData = data;
    //                 callback(data);
    //             }
    //         })
    //     }
    // };

    /**
         * get all vote by guid
         */
    this.getVote = function (guid, callback, update) {
      update = update || false
      const url = APPIQUERYURL + '/api/v1/elections/votes' + ((typeof guid !== typeof undefined) ? '?Id=' + guid : '')
      _this = this
      if (Object.keys(_this.voteData).length && !update) {
        callback(_this.voteData)
      } else {
        $.ajax({
          url,
          type: 'get',
          async: false,
          success (data) {
            // saving vote data, because not to do ajax second time
            _this.voteData = data
            callback(data)
          }
        })
      }
    }

    /**
         * get info
         */
    this.getInfo = function (callback, update) {
      const url = APPIQUERYURL + '/info'
      const _this = this

      if (Object.keys(_this.infoData).length && !update) {
        callback(_this.infoData)
      } else {
        $.ajax({
          url,
          type: 'get',
          async: false,
          success (data) {
            // saving info data, because not to do ajax second time
            _this.infoData = data
            callback(data)
          }
        })
      }
    }

    // this.getElectionComments = function (electionId) {
    //     let url = APPIQUERYURL + "/api/v1/elections/listcomments?electionId=" + electionId;
    //     return $.ajax({
    //         url: url,
    //         type: "get",
    //         dataType: "Json"
    //     })
    // };

    /**
         * get all comments
         */
    this.getAllComments = function (guid, update) {
      update = update || false
      if (currentPage != 'elections') {
        return false
      }

      this.getElectionById(guid, updateComment, update)

      if (ECO.MINIMAP.initialized) { ECO.MINIMAP.removeDeadViews() }

      function updateComment (data) {
        // if (typeof guid != typeof undefined) {
        //     for (let i = 0; i < data.length; i++) {
        //         if (data[i].Id == guid) {
        //             data = data[i];
        //             break;
        //         }
        //     }
        // }

        if ((data.Finished) && (typeof guid !== typeof undefined)) {
          // console.log('discussion hide');
          $('.election-discussion').hide()
        } else {
          $('.election-discussion').show()
        }

        $('.election-discussion .discussion-user').empty()
        // if (data instanceof Array) {
        //     data = data[0];
        // }
        const cycleLength = data.Comments.length

        for (let i = 0; i < cycleLength; i++) {
          let comment

          let isEdited
          data.Comments[i].Text = data.Comments[i].Text
            .replace(/\\{1,2}n/g, '<br>').replace(/\\"/g, '&quot').replace(/^["]|"$|\\/g, '')

          // checking if return text is valid json text
          if (/^[\],:{}\s]*$/.test(data.Comments[i].Text.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
            comment = JSON.parse(data.Comments[i].Text)

            // Editing feature to do
            // isEdited = JSON.parse(data.Comments[i].IsEdited);
          } else {
            comment = data.Comments[i].Text

            // Editing feature to do
            // isEdited = data.Comments[i].IsEdited;
          }
          while (comment.includes('\n')) {
            comment = comment.replace('\n', '<br>')
          }
          // getting days, hours and minutes from timestamp value of query
          const timestamp = data.Comments[i].Timestamp

          const commentTime = 'Posted on  ' + ConvertSecondsComments(timestamp)

          text = $("<div class='law-discussion-wrapper'></div>")

          const section1 = $("<div class='comment-section1'> </div>")

          // checking if a user can remove comment
          let removeComment = ''

          let editComment = ''

          const hasgraph = !!((data.Comments[i].Graph && data.Comments[i].Graph.Keys != ''))

          // including removeGraph and editgraph buttons
          if (data.Comments[i].Username == election.Creator) {
            removeComment = "<a data-graph='" + hasgraph + "' id='removeComment' href='javascript:void(0)'><i class='fa fa-times'></i> remove </a>"

            let graphs = ''

            if (hasgraph) {
              graphs = {
                categories: data.Comments[i].Graph.Keys,
                time_start: data.Comments[i].Graph.TimeMin,
                time_end: data.Comments[i].Graph.TimeMax
              }

              graphs = JSON.stringify(graphs)
            }

            editComment = "<a data-graph='" + graphs + "' id='editComment' href='javascript:void(0)'><i class='fa fa-edit'></i> edit </a>"
          }

          section1.append("<div class='law-discussion-user'>" + data.Comments[i].Username + "<span class='law-discussion-time'>" + commentTime + (isEdited ? "<i style='font-size:13px;'>&nbsp;(edited)</i>" : '') + "</span></div><div class='law-discussion-comment'>" + comment + '</div>')
          text.append(section1)

          let view = null

          if (data.Comments[i].Map != null && data.Comments[i].Map != '') {
            const viewer = $('</div><div class="view-map" id=map-' + data.Guid + '"></div>')
            section1.after(viewer)

            view = viewer[0]

            view.settings = data.Comments[i].Map
          }

          if (data.Comments[i].Graph && data.Comments[i].Graph.Keys != '') {
            text.append("<div class='discussion-graph' id='discussion-graph-" + i + "'></div>")
          }

          // Editing and removing comments on hold
          // text.append(removeComment);
          // text.append(editComment);
          $('.election-discussion .discussion-user').prepend(text)

          if (data.Comments[i].Graph && data.Comments[i].Graph.Keys != '') {
            getDiscussionGraphData('discussion-graph-' + i, data.Comments[i].Graph.Keys, data.Comments[i].Graph.TimeMin, data.Comments[i].Graph.TimeMax)
          }

          if (view && ECO.MINIMAP.initialized) {
            ECO.MINIMAP.addView(view)
          }
        }

        $('.current-rankings').hide()
      }
    }

    this.removeComment = function (comment, hasgraph) {
      comment = JSON.stringify(comment)

      const data = { Username: election.username, Text: comment }

      const url = APPIQUERYURL + '/api/v1/elections/removecomment?authtoken=' + election.authtoken
      $.ajax({
        url,
        type: 'Post',
        dataType: 'Json',
        data,
        success (response) {
          election.getAllComments(undefined, true)
        }
      })
    }

    /**
         * adding a comment
         */
    this.addComment = function (comment, isEdited) {
      if (typeof comment === typeof undefined) {
        comment = $('.election-discussion #comment').val()
      }

      if (election.username == null || election.authtoken == null) {
        election.showError('To add comment you need to access from the game server')
        return false
      }

      if (comment == '') {
        election.showError('The comment cannot be empty')
        return false
      }

      // if (this.settings['availableCommentPages'].indexOf(getURLParameter("election")) < 0) {
      //     election.showError("You can't add comment for Previous Election.");
      //     return false;
      // }

      $('.error').empty().fadeOut()

      if (comment) {
        comment = comment.replace(/\\n/, '<br>')
        const url = APPIQUERYURL + '/api/v1/elections/addcomment?electionId=' + getURLParameter('election') + '&authtoken=' + election.authtoken

        const data = {
          Username: election.username,
          Text: comment,
          //                    'IsEdited': isEdited
          Tag: election.username
        }

        if ($('#graph-data').val().length > 0) {
          const graph = JSON.parse($('#graph-data').val())

          data.Graph = {
            TimeMin: graph.time_start,
            TimeMax: graph.time_end,
            Keys: graph.variables
          }

          delete graph.variables
          delete graph.time_start
          delete graph.time_end
        }

        if ($('#main-map').css('display') != 'none' && $('#map-data').length && $('#map-data').val() != '' && $('#map-data').val() != null /* && $('.fancy-add-graph').is(":hidden") */) {
          data.Map = JSON.parse($('#map-data').val())
        }

        $.ajax({
          beforeSend (xhrObj) {
            xhrObj.setRequestHeader('Content-Type', 'application/json')
          },
          url,
          type: 'POST',
          data: JSON.stringify(data),

          success () {
            location.reload()
            // election.getAllComments(undefined,true);

            // $('#graph-data').val('');

            // $('#addGraph').attr('data-action', 'add').html('Add Graph').fadeIn();

            // $('#removeGraph').fadeOut();
            // $('.remove-map').fadeOut();
            // $('#comment').val('');

            // $('.comment-graph').remove();
            // $('#graph_composer').remove();

            // $("#map-control-wrapper").hide();
            // $('.fancy-add-map').show();
          },
          error (error) {
            this.showError(error)
          }
        })
      }
    }

    /**
         *
         * Displays all speeches in the election
         * @param int  x - how many speeches to show
         *
         */
    this.displayAllSpeeches = function () {
      const count = $('.vote-item').find('p.candidate-name .candidate-speech').length

      const characters = 300 // show "see more" link when the speech is have more than # characters

      let item = null

      // let isVoted = $(".candidate-name#" + election.username).length;
      // if(isVoted){
      // 	$("a#add-self").html('Update Speech').attr('data-action', 'update');
      // 	$('#election-propose-button').html('Update Speech').attr('data-action', 'update');

      // 	$('#remove-self').css('display', 'inline-block');
      // }
      if (count) {
        $('.vote-item p.candidate-name .candidate-speech').each(function () {
          if ($(this).html().length >= characters) {
            item = $(this)

            // include "see more" link only once
            if (item.find('span').length != 0) {
              return true
            }

            // dividing speech into two parts
            const text = item.html()

            const p1 = text.substring(0, characters)

            const p2 = text.substring((characters), text.length)

            const user = item.parent().attr('data-id').replace(' ', '_')

            item.html('')

            // adding "see more" link
            item.append('<span data-user=' + user + " class='part1'>" + p1 + '</span>')

            item.append("<span class='read_more'>... <a> <i class='fa fa-fw fa-caret-down'></i>See More</a> </span>")

            item.append("<span style='display:none;' data-user=" + user + " class='part2'>" + p2 + '</span>')

            // when a user clicks on "see more"
            $(document).on('click', '.read_more', function () {
              /* making visible whole speech and including "see_less" link */
              const current = $(this).parents('p.candidate-name').attr('data-id').replace(' ', '_')

              $(this).remove()

              // $(this).parent().find(".see_less").remove();

              $('.results-page').fadeOut()

              $('.vote-page').css('width', '100%')

              $('.candidate-speech p#' + current).find('.see_less').remove()

              $('span.part2[data-user=' + current + ']').fadeIn()

              $('span.part2[data-user=' + current + ']').after("<span class='see_less'> <a> <i class='fa fa-fw fa-caret-up'></i>See Less </a> </span>")
            })

            /* when a user clicks on "see less" */
            $(document).on('click', '.see_less', function () {
              /* Making only a part of speech visible and including "see_more" link */
              const current = $(this).parents('p.candidate-name').attr('data-id').replace(' ', '_')

              $(this).remove()

              $(this).parent().find('.read_more').remove()

              const count = $('.vote-item p .see_less').length

              if (count == 0) {
                $('.results-page').fadeIn()

                $('.vote-page').css('width', '55%')
              }

              $(this).remove()

              $('span.part2[data-user=' + current + ']').fadeOut()

              $('.candidate-speech p#' + current).find('.read_more').remove()

              $('span.part1[data-user=' + current + ']').after("<span class='read_more'> ... <a><i class='fa fa-fw fa-caret-down'></i> See More </a> </span>").fadeIn()
            })
          }
        })
      }
    }

    /**
         * Updating current election
         */
    this.updateCurrentElection = function () {
      $('#election-wrapper, .candidates-page').fadeOut()

      setTimeout(function () {
        election.getAllComments()

        election.showCandidates()

        $('.page:not(.results-page), #add-self, .law-discussion-textarea, .law-discussion-textarea + div, .info, .info + small, .vote-item+button ').fadeIn()

        $('#election-wrapper').fadeIn() // ?

        $('.vote-item p').each(function () {
          if ($(this).id == election.username && typeof $(this).id !== typeof undefined) {
            $('#remove-self').fadeIn()
            return false
          }
        })
      }, 500)
    }

    this.voteBoolean = function () {
      const rankedVotes = []

      const first = $('input[name=options]:checked').val()
      rankedVotes.push(first)
      $('input[name=options]:not(:checked)').each((i, item) => {
        rankedVotes.push($(item).val())
      })

      const url = APPIQUERYURL + '/api/v1/elections/vote?authtoken=' + election.authtoken
      const settings = {
        beforeSend (xhrObj) {
          xhrObj.setRequestHeader('Content-Type', 'application/json')
        },
        async: false,
        url,
        method: 'post',
        data: JSON.stringify({
          ElectionID: election.electionData.Id,
          Voter: election.username,
          RankedVotes: rankedVotes
        }),
        success (data) {
          location.reload()
        },
        error (err) {
          variables.showError(err)
        }
      }
      // load the Election page when the ajax request is done
      return $.ajax(settings)
    }
    /**
         * voting
         */
    this.vote = function () {
      if (election.username == null || election.authtoken == null) {
        election.showError('To vote you must be logged in.')
        return false
      }

      if (election.electionData.BooleanElection) {
        this.voteBoolean()
        return
      }

      const RankedVotes = []

      const data = []

      let valid = true

      const values = []

      $('.vote select').each(function () {
        const x = $(this).find('option:selected')

        const user = $(this).parent().data('user')

        const value = x.val()
        if (value && value != 0) {
          RankedVotes.push(user)

          data[value] = user

          values.push(parseInt(value))
        }
      })

      const sending = []
      data.forEach(function (item, ind) {
        sending.push(item)
      })

      if (RankedVotes.length == 0) {
        election.showError('No candidates were ranked.')
        return false
      }

      $('.error').empty().fadeOut()

      const url = APPIQUERYURL + '/api/v1/elections/vote?authtoken=' + election.authtoken

      const cycleLength = values.length
      // if value is undefined then remove it from array
      for (let i = 0; i < cycleLength; i++) {
        if (typeof values[i] === typeof undefined) {
          values.splice(i, 1)
        }
      }

      // sort values to check if any vote's missing
      values.sort(function (a, b) {
        return a - b
      })

      // check if some number is missing
      const message = "The selection can't skip any number"
      const max = values[values.length - 1]

      const s = sum(max)

      const arrSum = values.reduce(function (a, b) {
        return a + b
      })

      if (s != arrSum) {
        valid = false
      }

      if (!valid) {
        election.showError(message)
        return false
      }

      // console.log(sending); return false;
      // RankedVotes = JSON.stringify(sending);

      // make an ajax request to send vote to the server
      const settings = {
        beforeSend (xhrObj) {
          xhrObj.setRequestHeader('Content-Type', 'application/json')
        },
        url,
        method: 'Post',
        data: JSON.stringify({
          ElectionID: election.electionData.Id.replace(/(["'])/g, '\\$1'),
          Voter: election.username,
          RankedVotes
        })
      }
      // load the Election page when the ajax request is done
      $.ajax(settings).done(function (response) {
        location.reload()
      }).fail(function (err) {
        variables.showError(err)
      })
    }

    function updateInfo (data, guid) {
      const isPrevious = (data.Finished) // $('.previous-election.active-election').length;

      // updating election info
      if (Array.isArray(data)) {
        data = data[0]
      }
      // if (data.Candidates.length != 0) {

      let info = ''
      let timeItem = ''
      if (isPrevious !== false) {
        const prevEnded = ConvertSeconds(data.TimeEndAgo)
        timeItem = "<li><span class='localize' translate-key='153'>Ended</span>  " + prevEnded + " <span class='localize' translate-key='154'>ago</span></li>"
        // info += "<li>" +(data.Results.Winner != "") ? "<span class='localize' translate-key='159'>The winner was</span> " + data.Results.Winner + ".</li>" : "There was no winner.</li>";
      } else {
        const timeSince = ConvertSeconds(data.TimeStart)
        timeItem = "<li><span class='localize' translate-key='170'>Since</span>  " + timeSince + " <span class='localize' translate-key='154'>ago</span></li>"
      }

      info += timeItem
      // }

      const names = []

      data.Choices.forEach(function (item, index) {
        names.push(item.Name)
      })

      $('#candidate-names').val(JSON.stringify(names))

      $('.current-rankings table tr:first-of-type td').html("<span class='localize' translate-key='134'>All Votes</span>")
      votersCount = data.TotalVotes

      $('.candidate-speech p').remove()

      $('.vote .vote-item').remove()
      const res = isPrevious ? 'Final Results' : 'Current Results'

      $('.section-title-results span').empty().append(res)

      info += '<li>' + data.TotalVotes + (data.TotalVotes == 1 ? " <span class='localize' translate-key='148'>vote</span>" : " <span class='localize' translate-key='149'>votes</span>") + " <span class='localize' translate-key='132'>total</span>. </li>"

      // let winnerInfo;

      /*	if(isPrevious == 0 && typeof guid == typeof undefined){
                        info += (data.Results.Winner == "") ? "<li>Winner will become the world leader.</li>" : "<li>Winner will replace current leader: <span class='text-highlight'> " + data.Results.Winner + "</span>.</li>";
                    } */
      /* if(isPrevious == 0 && typeof guid == typeof undefined && data.Results.Result != 'Election ends in a tie. No winner.'){
                let leaderReplace = (data.Results.Winner == "") ? " and will become the world leader." : " and will replace " + data.Results.Winner + " as world leader.";
            } else { let leaderReplace = ''; } */
      const leaderReplace = '.'

      if ((isPrevious === false) && (typeof guid === typeof undefined)) {
        info += "<li><b><span class='localize' translate-key='147'>Projected result:</span></b> " + data.Results.Result + leaderReplace + '</li>'
      }

      if (data.ResultsDescription) {
        //   info += "<li>" + data.Results.StatusMessage + "</li>";
        info += '<li>' + data.ResultsDescription + '</li>'
      }

      if (!data.BooleanElection) {
        const runoffVotingTemplate = $.templates('#election-run-off-voting-template')
        info += runoffVotingTemplate.render()
      }
      $('.election-info').html(info)

      // if (isPrevious == 0 && typeof guid == typeof undefined) {
      //     let info2 = "<li><span class='localize' translate-key='129'>Rank the candidates from best to worst.</span></li>";
      // }

      // $('.candidates-info').append(info2);
    }

    /**
         *  show candidates and their speeches
         */
    this.showCandidates = function (guid) {
      if (currentPage !== 'elections') {
        return false
      }

      const url = null

      const isPrevious = $('.previous-election.active-election').length
      // $('#elections-page-instructions-wrapper').hide();

      // disable selects when the previous page is loaded
      const active = ''

      // if (isPrevious === 0 && typeof guid === typeof undefined) {
      //     type = 'current'
      // } else {
      //     type = 'previous';
      //     active = "disabled";
      // }

      let rank = 0
      let candidates_count = 0
      const candidates_votes = []
      const votersCount = 0
      const _this = this

      this.getElectionById(guid, showCandidates)

      function showCandidates (data) {
        election.runningElection = data

        updateInfo(data, guid)

        // votes per round table
        let results = data.Results.ChoiceRanks
        let rounds = 0
        window.results = results

        results = results.sort(function (a, b) {
          a = a.VotesPerRound[a.VotesPerRound.length - 1]
          b = b.VotesPerRound[b.VotesPerRound.length - 1]
          return b - a
        })

        if (data.BooleanElection) {
          const vData = new class votesCollection extends Array {
            sum (key) {
              return this.reduce((a, b) => a + (b[key] || 0), 0)
            }
          }()
          const electionChoices = data.Choices
          electionChoices.forEach((item) => {
            const r = results.find(resultItem => resultItem.ChoiceID === item.Id)
            if (r !== undefined) {
              vData.push({
                name: item.Name,
                y: r.Votes
              })
            }
          })
          const totalVotes = vData.sum('y')
          if (totalVotes) {
            const electionsGraph = new ElectionVotingGraph('election-chart-voting-results-container')
            electionsGraph.draw(vData)
          }
        }
        // return false;
        const candidates_ordered_arr = []
        results.forEach(function (item, index) {
          if (item.VotesPerRound.length > rounds) {
            rounds = item.VotesPerRound.length
          }

          for (let idx = 0; idx < data.Choices.length; idx++) {
            const elem = data.Choices[idx]
            const domElem = document.createElement('z')
            domElem.innerHTML = item.MarkedUpName
            const domElemText = domElem.textContent
            if (domElemText.toLocaleLowerCase() === elem.Name.toLocaleLowerCase()) {
              candidates_ordered_arr.push(elem)
              break
            }
          }
        })

        data.Candidates = candidates_ordered_arr
        /* /styling table
                if(rounds <= 3){
                    $('.votes-per-round table').css('width', "74%");
                }else if(rounds <= 5){
                    $('.votes-per-round table').css('width', "85%");
                }else{
                    $('.votes-per-round table').css('width', "100%");
                } */

        //                if no one has voted yet
        if (rounds == 0) {
          $('.no-votes').show()
          $('.votes-per-round table, .current-rankings, .view-all-votes').css('display', 'none')
        } else {
          $('.votes-per-round table').show()
          $('.no-votes').hide()
        }

        $('.votes-per-round table tr:not(.title-heading)').remove()

        $('.votes-per-round table tr:first-of-type td').attr('colspan', rounds + 1)

        const row = $("<tr class='table-top'> <td class=' table-top-left'> <span class='localize' translate-key='25'>Candidates</span> </td> </tr>")

        for (let i = rounds; i > 0; i--) {
          row.append("<td><span class='localize' translate-key='131'>Round</span>  " + i + '</td>')
        }
        $('.votes-per-round table').append(row)

        const candidates = data.Candidates

        if (candidates.length === 0) {
          return false
        }
        candidates_count = candidates.length

        $('.candidates-page .candidate-name').empty()
        const cycleLength = candidates.length
        for (let i = 0; i < cycleLength; i++) {
          // appending candidate names into "votes per round" table
          const r = $("<tr class='table-middle' data-candidate = '" + candidates[i].Id + "'> <td  class='table-left'> " + candidates[i].Name + ' </td> </tr>')
          for (let td = rounds; td > 0; td--) {
            r.append("<td class='round-vote' data-round = '" + (td) + "'> </td>")
          }
          $('.votes-per-round table').append(r)

          if (candidates[i].Speech !== undefined) {
            // let votingData = data.Results.CandidateRounds;

            const append = $("<p class='candidate-name' id='" + candidates[i].CandidateName + "'> <span> " + candidates[i].CandidateName + ':  </span> <label>' + decode(candidates[i].Speech) + '</label> </p>')

            const row = $("<div class='vote-item' data-user='" + candidates[i].Name + "'> </div>")

            const select = $('<select ' + active + ' > </select>')
            row.append(select)

            row.append("<p data-id='" +
                            candidates[i].Name.replace(' ', '-') +
                            "' class='candidate-name' id='" +
                            candidates[i].Name +
                            "'><span class='candidate-name-title'> " +
                            candidates[i].Name +
                            ":</span> <span class='candidate-speech'>" +
                            decode(candidates[i].Speech) + '</span></p>')
            $('.vote button').before(row)

            if (candidates[i].CandidateName === election.Creator && typeof guid === typeof undefined) {
              $('a#add-self').hide()
              $('#add-self').html('update speech').attr('data-action', 'update')
              $('#election-propose-button').html('Update Speech').attr('data-action', 'update')
              $('#remove-self').css('display', 'inline-block')
            }
          } else {
            rank++
          }
        }
        election.displayAllSpeeches()

        if ($('#candidate-names').length !== 0) {
          if (typeof guid !== typeof undefined) {
            setupTable(guid)
          } else {
            setupTable()
          }
        }
        // updating data in votes per rounds table
        let novotes = 0
        results.forEach(function (item, index) {
          // getting each candidate votes
          const v = item.VotesPerRound
          if (v.length == 0) {
            novotes++
          }

          $('.votes-per-round table tr[data-candidate="' + item.ChoiceID + '"] td').each(function () {
            const roundNumber = $(this).attr('data-round')

            if (typeof roundNumber !== typeof undefined) {
              const count = (typeof v[roundNumber - 1] !== 'undefined') ? v[roundNumber - 1] : 'X'

              $(this).html(count)

              // make X's red
              if (count == 'X') {
                $(this).addClass('red')
              }
            }
          })
        })

        // making each column's high value bold
        for (let i = 1; i <= rounds; i++) {
          let max = 0

          $('.votes-per-round table td[data-round=' + i + ']').each(function () {
            if ($(this).html() != 'X') {
              const value = parseInt($(this).html())
              if (value > max) {
                max = value
              }
            }
          })

          $('.votes-per-round table td[data-round=' + i + ']').each(function () {

            /* if($(this).html() == max){
                            $(this).css('font-weight', 'bolder');
                        } */
          })
        }

        // if (novotes < results.length) {
        //     $('.results-page').fadeIn();
        // } else {
        //     $('.results-page').fadeOut();
        // }

        const total = $("<tr class='table-bottom'> <td> <span class='localize' translate-key='132'>Total</span></td> </tr>")

        for (let i = rounds; i > 0; i--) {
          let round = 0

          $('.votes-per-round tr td').each(function () {
            if (typeof $(this).data('round') !== 'undefined') {
              if ($(this).data('round') == i && $(this).html() != 'X') {
                round += parseInt($(this).html())
              }
            }
          })

          total.append("<td data-total='" + (i + 1) + "'>" + round + '</td>')
        }

        $('.votes-per-round table').append(total)

        if (data.PositionForWinner !== undefined) {
          const positionForWinnerTableTemplate = $.templates('#position-for-winner-table-template')
          const html = positionForWinnerTableTemplate.render(data.PositionForWinner)

          $('#position-for-winner-table').html(html)

          $('#position-for-winner-table .flat-table .table-middle:odd').addClass('table-alternating-color-1')
          $('#position-for-winner-table .flat-table .table-middle:even').addClass('table-alternating-color-2')
        }

        /* sorting the "votes per round" table */
        _this.getVote(guid, tableShow)

        function tableShow (data) {
          // if user already voted
          data.forEach(function (item, index) {
            if (item.Voter === election.username) {
              $('.vote-button').html('<span class="localize" translate-key="130">Update Vote</span>')
            }
          })
          // console.log(data);

          const cycleLength = data.length

          for (let i = 0; i < cycleLength; i++) {
            const newCycleLength = data[i].RankedVotes.length
            for (let j = 0; j < newCycleLength; j++) {
              $(".current-rankings table tr[data-voter='" + data[i].Voter + "'] td").each(function () {
                const user = $(this).data('user')

                if (typeof user !== 'undefined') {
                  let rank = $.inArray(user, data[i].RankedVotes)

                  if (rank == -1) {
                    $(this).html('')
                  } else {
                    rank = rank + 1
                    $(this).attr('data-value', rank)
                    if (election.electionData.BooleanElection) {
                      rank = rank === 1 ? '<i class="fa fa-check bool-choice-value"></i>' : ''
                    }
                    $(this).html(rank)
                  }
                }
              })
            }
          }

          // if (getURLParameter("election") != null) {
          //     if ($("tr[data-voter='" + election.username + "']").length == 0) {
          //         $(".vote-item select").hide();
          //     }
          // }
        }

        $('.vote-item select option').remove()
        for (let j = 0; j <= candidates_count - rank; j++) {
          if (j === 0) {
            $('.vote-item select').append("<option value='0'> - </option>")
          } else {
            $('.vote-item select').append("<option value='" + j + "'>" + j + '</option>')
          }
        }
      }
    }

    /** selected="selected"
         * remove yourself from the candidates list
         */
    this.removeSelf = function () {
      const speech = $('.vote-item  p#' + election.username).html()

      const url = APPIQUERYURL + '/api/v1/elections/removecandidate?authtoken=' + election.authtoken + '&speech=' + speech

      $.post(url, function (status, data) {
        $('.current-election').trigger('click')
      })
    }

    /* loads previous elections pages */
    this.loadElectionPage = function (id) {
      const that = this

      const electionCallback = (electionData) => {
        $('#elections-page-instructions-wrapper').hide()

        that.showCandidates(id)
        that.getAllComments(id)
        that.showElectionName(electionData)
        that.showElectionProcessLink(electionData)

        const hideVoting = (electionData.Finished || !this.authtoken)

        if (electionData.BooleanElection) {
          that.showElectionActionOnCompleteTable(id)
        }

        if (electionData.BooleanElection) {
          $('.multi-choice-election').hide()
          const candidatesTemplate = $.templates('#boolean-election-voting-template')
          $('#choice-election-vote-wrapper').prepend(candidatesTemplate.render(electionData))
          const yesNoChoicesTemplate = $.templates('#yes-no-vote-items')
          $('#election-vote .add-self-wrapper').prepend(yesNoChoicesTemplate.render(electionData))
          if (hideVoting) {
            $('.candidates-wrapper').hide()
          }
        } else {
          const candidatesTemplate = $.templates('#choice-election-voting-template')
          $('#choice-election-vote-wrapper').prepend(candidatesTemplate.render())
          $('#election-chart-voting-results-container').hide()
        }

        if (electionData.Finished || !this.authtoken) { // if not running election
          $(' #add-self, .vote p.info, .election-comment, .election-comment + div, .info + small, .vote-button').hide()
          $('.vote-item select').hide()
          $('.bool-choice-controls').hide()
        } else {
          $(' #add-self, .vote p.info, .election-comment, .election-comment + div, .info + small, .vote-button').show()
        }

        $('#election-wrapper, #wrapper, .vote-page').show()
        $('.current-rankings').show()
      }

      this.getElectionById(id, electionCallback, false)
    }

    // /* show the most recent election */
    // this.showRecent = function(){
    // 	let url = APPIQUERYURL + "/api/v1/elections/previous";
    // 	$.get(url, function(data, status){
    // 		if(status == "success"){
    // 			let recent = data.sort(function(a,b){
    // 				return a.TimeEndAgo-b.TimeEndAgo;
    // 			})[0].Guid;
    //
    // 			election.loadElectionPage(recent);
    //
    // 		}
    // 	})
    //
    // }

    // call setupTable funcion from election object
    this.setupTable = function (guid) {
      setupTable(guid)
    }
  }

  function getURLParameter (name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ''])[1].replace(/\+/g, '%20')) || null
  }

  /**
     *  Setting up current rankings table
     */
  function setupTable (guid) {
    election.getVote(guid, setupTable)

    function setupTable (data) {
      const candidateNames = $('#candidate-names')
      if (candidateNames.length === 0 || !candidateNames.val()) {
        return false
      }

      /* getting the candidates data to include it on the table */
      const candidates = JSON.parse(candidateNames.val())

      /* changing font size of the table depending on the data length */
      let fontSize = '20px'
      let w = '25%'

      if (candidates.length > 10) {
        fontSize = '14px'
        w = '50%'
      } else if (candidates.length > 15) {
        fontSize = '10px'
        w = '70%'
      } else if (candidates.length > 25) {
        fontSize = '10px'
        w = '100%'
      }
      // $('.current-rankings table').css({"width": w, "font-size": fontSize });

      /* UPDATING THE TABLE */

      /* first: removing all rows except heading */
      $('.current-rankings table tr:not(:first-child)').remove()
      const cycleLength = data.length
      /* appending updated rows based on the candidates data */
      for (let i = 0; i <= cycleLength + 1; i++) {
        const row = $('<tr> </tr>')
        const newCycleLength = candidates.length

        for (let j = 0; j <= newCycleLength; j++) {
          if (i == 0 && j == 0) {
            if (!election.electionData.BooleanElection) {
              const headerStr = "<td class='table-key' colspan='" + candidates.length + "'> <span class='localize' translate-key='133'>Candidates Ranked</span> </td>"
              row.append(headerStr)
            }
          } else if (j == 0 && i != 1) {
            row.append('<td> ' + data[i - 2].Voter + '</td>')

            row.attr('data-voter', data[i - 2].Voter)

            row.attr('class', 'table-middle')
          } else if (j == 0) {
            if (i == 1) {
              row.append("<td class='table-top table-top-left table-key'><span class='localize' translate-key='135'>Voters</span></td>")
            }
          } else if (i == 1) {
            row.append("<td class='table-top'> " + candidates[j - 1] + ' </td>')
          } else if (i != 0) {
            row.append("<td class='rank' data-user='" + candidates[j - 1].trim() + "' data-rank='" + j + "'></td>")

            row.attr('class', 'table-middle')
          }
        }

        $('.current-rankings table').append(row)
      }
      /* making the first row of the table to take all space */
      $('.current-rankings table tr:first-child td').attr('colspan', candidates.length + 1)

      // Sideways Y-axis Title
      // $('.current-rankings .table-left:first').append("<div class='table-key-left'>VOTERS</div>");

      // Alternating colors on tables
      $('.flat-table .table-middle:odd').addClass('table-alternating-color-1')
      $('.flat-table .table-middle:even').addClass('table-alternating-color-2')

      // updating the selects based on the user's selections
      setTimeout(function () {
        const userSelection = $(".current-rankings tr[data-voter='" + election.username + "']")

        if (!userSelection.length && $('.active-election').length) {
          $('.vote-item select').hide()
          return false
        }
        const obj = []
        userSelection.find('td.rank').each(function () {
          const item = {}
          item.candidate = $(this).attr('data-user')
          item.vote = $(this).attr('data-value')
          obj.push(item)
        })

        obj.forEach(function (elm) {
          $(".vote-item[data-user='" + elm.candidate + "'] select option[value='" + elm.vote + "']").attr('selected', 'selected')
        })

        if (election.electionData.BooleanElection) {
          const currentVote = data.find(x => x.Voter === election.username)
          if (currentVote) {
            const currentChoice = currentVote.RankedVotes[0]
            const currentChoiceControl = $('#bool-choice-input-' + currentChoice)
            currentChoiceControl.parent().addClass('active')
            currentChoiceControl.attr('checked', 'checked')
          }
        }
      }, 1000)
    }
  }

  // converts seconds into days, hours, minutes
  function ConvertSeconds (seconds, mode, x) {
    // converting seconds into a number
    seconds = parseFloat(seconds)

    let result = ''

    // getting days
    const days = parseInt(seconds / 86400)

    // getting hours
    const hours = parseInt((seconds - (86400 * days)) / 3600)

    const middle = (86400 * days) + (3600 * hours)

    // getting minutes
    const minutes = parseInt((seconds - middle) / 60)

    // constructing the return text
    if (days !== 0) {
      result += days + ' ' + ((days === 1) ? "<span class='localize' translate-key='38'>day</span> " : "<span class='localize' translate-key='155'>days</span> ")
    }

    if (hours !== 0) {
      result += hours + ' ' + ((hours === 1) ? "<span class='localize' translate-key='143'>hr</span> " : " <span class='localize' translate-key='156'>hrs</span> ")
    }

    if (minutes !== 0) {
      result += minutes + ' ' + ((minutes === 1) ? "<span class='localize' translate-key='144'>min</span> " : "<span class='localize' translate-key='157'>min</span> ")
    }

    if (days === 0 && hours === 0 && minutes === 0) {
      result = parseInt(seconds) + ' secs'
    }

    // the case when we want to get only day and hour
    if (typeof mode !== typeof undefined) {
      if (typeof x === typeof undefined) {
        return { day: days, hour: hours }
      } else if (x === 'day') {
        return { day: days }
      } else if (x === 'hour') {
        const hour = parseInt(seconds / 3600)

        return { hour }
      }
    }

    return result
  }

  function decode (string) {
    const encodedStr = string.replace(/[\u00A0-\u9999<>&]/gim, function (i) {
      return '&#' + i.charCodeAt(0) + ';'
    })
    return encodedStr
  }

  function sum (x) {
    if (x === 1) {
      return 1
    } else {
      return x + sum(x - 1)
    }
  }

  // create unique election object
  const election = new Election()

  $(document).ready(function () {
    if (typeof bindAllElectionEvents !== 'undefined' && $.isFunction(bindAllElectionEvents)) { bindAllElectionEvents(election) }
  })
})()
