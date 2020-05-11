// interval tree global object for querying purpose.
// interval tree start
var IntervalTree = (function() {
    var IntervalTree = function(intervals) {
        this.root = new IntervalTreeNode();
        this.root.construct(intervals);
    };

    IntervalTree.prototype.getRoot = function() {
        return this.root;
    };

    IntervalTree.prototype.queryPoint = function(point) {
        var results = [];
        var root = this.getRoot();
        return this._queryPoint(root, point, results);
    };

    IntervalTree.prototype._queryPoint = function(v, q, results) {
        var i, it;
        if (v === null) {
            return results;
        } else if (q == v.getXMid()) {
            for (i=0; i < v.getLeftSet().length; i++) {
                it = v.getLeftSet()[i];
                results.push(it);
            }
            return results;
        } else if (q < v.getXMid()) {
            for (i=0; i < v.getLeftSet().length; i++) {
                it = v.getLeftSet()[i];
                if (it.start <= q) {
                    results.push(it);
                }
            }
            return this._queryPoint(v.getLeftChild(), q, results);
        } else if (q > v.getXMid()) {
            for (i=0; i < v.getRightSet().length; i++) {
                it = v.getRightSet()[i];
                if (it.end >= q) {
                    results.push(it);
                }
            }
            return this._queryPoint(v.getRightChild(), q, results);
        }
    };

    IntervalTree.prototype.query = function(q_start, q_end) {
        var results = [];
        return this._query(this.getRoot(), q_start, q_end, results);
    };

    IntervalTree.prototype._query = function(v, q_start, q_end, results) {
        if (v === null) {
            return results;
        } else if (q_start == q_end) {
            return this._queryPoint(v, q_start, results);
        }
        if (q_start > q_end) {
            q_tmp = q_start;
            q_start = q_end;
            q_end = q_tmp;
        }
        var child;
        var intervalSet;

        if (q_start <= v.getXMid()) {
            intervalSet = v.getLeftSet();
        } else if (q_start > v.getXMid()) {
            intervalSet = v.getRightSet();
        }

        for (var i=0; i < intervalSet.length; i++) {
            var it = intervalSet[i];
            if (it.start <= q_end && it.end >= q_start) {
                results.push(it);
            }
        }
        this._query(v.getLeftChild(), q_start, q_end, results);
        this._query(v.getRightChild(), q_start, q_end, results);
        return results;
    };

    function IntervalTreeNode() {
        this.leftChild = null;
        this.rightChild = null;
        this.mLeftSet = null;
        this.mRightSet = null;
        this.xMid = null;
        this.construct = function(intervals) {
            if (intervals.length === 0) {
                return null;
            }
            this.xMid = median(intervals);
            var lSet = [];
            this.mLeftSet = [];
            this.mRightSet = [];
            var rSet = [];
            for (var i=0; i < intervals.length; i++) {
                var elem = intervals[i];
                if (elem.end < this.xMid) {
                    lSet.push(elem);
                } else if (elem.start > this.xMid) {
                    rSet.push(elem);
                } else {
                    this.mLeftSet.push(elem);
                    this.mRightSet.push(elem);
                }
            }
            this.mLeftSet.sort(sortByKey('start'));
            this.mRightSet.sort(sortByKey('end'));
            var nc = new IntervalTreeNode();
            if( nc.construct(lSet) ) {
                this.leftChild = nc;
            }
            nc = new IntervalTreeNode();
            if (nc.construct(rSet) ) {
                this.rightChild = nc;
            }
            return true;
        };

        IntervalTreeNode.prototype.getXMid = function() {
            return this.xMid;
        };

        IntervalTreeNode.prototype.getLeftChild = function() {
            return this.leftChild;
        };

        IntervalTreeNode.prototype.getRightChild = function() {
            return this.rightChild;
        };

        IntervalTreeNode.prototype.getLeftSet = function() {
            return this.mLeftSet;
        };

        IntervalTreeNode.prototype.getRightSet = function() {
            return this.mRightSet;
        };
    }

    function sortByKey(key) {
        return function(a, b) {
            if (a[key] < b[key]) return -1;
            else if (a[key] > b[key]) return 1;
            else return 0;
        };
    }

    function sortInt(a, b) {
        if (a < b) return -1;
        else if (a > b) return 1;
        else return 0;
    }

    function median(intervals) {
        var endpoints = [];
        intervals.forEach(function(elem){
            endpoints.push(elem.start);
            endpoints.push(elem.end);
        });
        if(endpoints.length == 2){
            return endpoints[0];
        } else {
            endpoints.sort(sortInt);
            return endpoints[parseInt(endpoints.length / 2)];
        }
    }


    IntervalTree.IntervalTree = function(intervals) {
        var root = new IntervalTreeNode();
        root.construct(intervals);

        /* v - root of the IntervalTree
         * d - interval object
         */
        IntervalTree.prototype.insert = function(v, d) {
        };

        /* v - root of the IntervalTree
         * q - query point
         */
        IntervalTree.prototype.query = function(v, q, results) {
            var i, it;
            if (v === null) {
                return;
            } else if (q == v.getXMid()) {
                results.concat(v.getLeftSet());
                return;
            } else if (q < v.getXMid()) {
                for (i=0; i < v.getLeftSet().length; i++) {
                    it = v.getLeftSet().at(i);
                    if (it.start < q) {
                        results.push(it);
                    }
                }
                self.query(v.getLeftChild(), q, results);
            } else if (q > v.getXMid()) {
                for (i=0; i < v.getRightSet().length; i++) {
                    it = v.getRightSet()[i];
                    if (it.end > q) {
                        results.push(it);
                    }
                }
                self.query(v.getRightChild(), q, results);
            }
        };
        IntervalTree.prototype.getRoot = function() {
            return this.root;
        };
    };

    return IntervalTree;
})();

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = IntervalTree;
else
    window.Validator = IntervalTree;


// INTERVAL TREE END

// FRONT END CODE START
var tree;
$(document).ready(function(){
    function ajaxTranscriptRetriever() {
        var video_id = $("#video-id").data("text")
        var url = '/video/transcript/'+video_id
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: url,
                success: function(data) {
                    resolve(data) // Resolve promise and go to then()
                },
                error: function(err) {
                    console.log("Error in JS Promise");
                    reject(err) // Reject the promise and go to catch()
                }
            });
        });
    }

    ajaxTranscriptRetriever().then(function(data) {
        var reqId;
        var video = document.getElementById("video-active")
        var startTracking = function() {
            reqId = requestAnimationFrame(function play() {
                console.log(video.currentTime);
                onTrackedVideoFrame(video.currentTime, video.currentTime, {})
                reqId = requestAnimationFrame(play);
            });
        };

        var stopTracking = function () {
            if (reqId) {
                cancelAnimationFrame(reqId);
            }
        };
        video.addEventListener('play', startTracking);
        video.addEventListener('pause', stopTracking);

        // var data = {"jobName":"test","accountId":"576861690619","results":{"transcripts":[{"transcript":"Hello, everyone. Thank you guys for coming to our weekly student success meeting. Um, and let's just get started. So I have our list of chronically absent students here, and I've been noticing a troubling trend. Ah, lot of students are skipping on Fridays. Does anyone have any idea what's going on? I've heard some of my mentees talking about how it's really hard to get out of bed on Fridays. It might be good if we did something like a pancake breakfast to encourage them to come."}],"speaker_labels":{"speakers":1,"segments":[{"start_time":"0.04","speaker_label":"spk_0","end_time":"16.55","items":[{"start_time":"0.04","speaker_label":"spk_0","end_time":"0.54"},{"start_time":"0.54","speaker_label":"spk_0","end_time":"0.96"},{"start_time":"0.96","speaker_label":"spk_0","end_time":"1.24"},{"start_time":"1.24","speaker_label":"spk_0","end_time":"1.32"},{"start_time":"1.32","speaker_label":"spk_0","end_time":"1.6"},{"start_time":"1.6","speaker_label":"spk_0","end_time":"1.75"},{"start_time":"1.75","speaker_label":"spk_0","end_time":"2.22"},{"start_time":"2.22","speaker_label":"spk_0","end_time":"2.31"},{"start_time":"2.31","speaker_label":"spk_0","end_time":"2.45"},{"start_time":"2.45","speaker_label":"spk_0","end_time":"2.87"},{"start_time":"2.87","speaker_label":"spk_0","end_time":"3.3"},{"start_time":"3.3","speaker_label":"spk_0","end_time":"3.78"},{"start_time":"3.78","speaker_label":"spk_0","end_time":"4.33"},{"start_time":"4.66","speaker_label":"spk_0","end_time":"5.11"},{"start_time":"5.11","speaker_label":"spk_0","end_time":"5.34"},{"start_time":"5.34","speaker_label":"spk_0","end_time":"5.52"},{"start_time":"5.52","speaker_label":"spk_0","end_time":"5.69"},{"start_time":"5.69","speaker_label":"spk_0","end_time":"5.84"},{"start_time":"5.84","speaker_label":"spk_0","end_time":"6.32"},{"start_time":"6.46","speaker_label":"spk_0","end_time":"6.74"},{"start_time":"6.74","speaker_label":"spk_0","end_time":"6.8"},{"start_time":"6.8","speaker_label":"spk_0","end_time":"7.0"},{"start_time":"7.0","speaker_label":"spk_0","end_time":"7.12"},{"start_time":"7.12","speaker_label":"spk_0","end_time":"7.41"},{"start_time":"7.41","speaker_label":"spk_0","end_time":"7.54"},{"start_time":"7.54","speaker_label":"spk_0","end_time":"8.01"},{"start_time":"8.01","speaker_label":"spk_0","end_time":"8.38"},{"start_time":"8.38","speaker_label":"spk_0","end_time":"8.8"},{"start_time":"8.8","speaker_label":"spk_0","end_time":"9.21"},{"start_time":"9.22","speaker_label":"spk_0","end_time":"9.79"},{"start_time":"9.79","speaker_label":"spk_0","end_time":"9.9"},{"start_time":"9.9","speaker_label":"spk_0","end_time":"10.01"},{"start_time":"10.01","speaker_label":"spk_0","end_time":"10.41"},{"start_time":"10.41","speaker_label":"spk_0","end_time":"10.47"},{"start_time":"10.47","speaker_label":"spk_0","end_time":"11.03"},{"start_time":"11.03","speaker_label":"spk_0","end_time":"11.75"},{"start_time":"12.14","speaker_label":"spk_0","end_time":"12.6"},{"start_time":"12.6","speaker_label":"spk_0","end_time":"12.78"},{"start_time":"12.78","speaker_label":"spk_0","end_time":"12.86"},{"start_time":"12.86","speaker_label":"spk_0","end_time":"13.23"},{"start_time":"13.23","speaker_label":"spk_0","end_time":"13.3"},{"start_time":"13.3","speaker_label":"spk_0","end_time":"13.75"},{"start_time":"13.75","speaker_label":"spk_0","end_time":"13.9"},{"start_time":"13.9","speaker_label":"spk_0","end_time":"14.56"},{"start_time":"14.56","speaker_label":"spk_0","end_time":"14.81"},{"start_time":"14.81","speaker_label":"spk_0","end_time":"15.17"},{"start_time":"15.17","speaker_label":"spk_0","end_time":"15.38"},{"start_time":"15.38","speaker_label":"spk_0","end_time":"15.58"},{"start_time":"15.58","speaker_label":"spk_0","end_time":"15.82"},{"start_time":"15.82","speaker_label":"spk_0","end_time":"15.99"},{"start_time":"15.99","speaker_label":"spk_0","end_time":"16.25"},{"start_time":"16.25","speaker_label":"spk_0","end_time":"16.55"}]},{"start_time":"17.25","speaker_label":"spk_0","end_time":"25.55","items":[{"start_time":"17.25","speaker_label":"spk_0","end_time":"17.4"},{"start_time":"17.4","speaker_label":"spk_0","end_time":"17.57"},{"start_time":"17.57","speaker_label":"spk_0","end_time":"17.68"},{"start_time":"17.68","speaker_label":"spk_0","end_time":"17.77"},{"start_time":"17.77","speaker_label":"spk_0","end_time":"17.88"},{"start_time":"17.88","speaker_label":"spk_0","end_time":"18.35"},{"start_time":"18.35","speaker_label":"spk_0","end_time":"18.67"},{"start_time":"18.67","speaker_label":"spk_0","end_time":"18.93"},{"start_time":"18.93","speaker_label":"spk_0","end_time":"19.2"},{"start_time":"19.2","speaker_label":"spk_0","end_time":"19.41"},{"start_time":"19.41","speaker_label":"spk_0","end_time":"19.69"},{"start_time":"19.69","speaker_label":"spk_0","end_time":"19.95"},{"start_time":"19.95","speaker_label":"spk_0","end_time":"20.02"},{"start_time":"20.02","speaker_label":"spk_0","end_time":"20.14"},{"start_time":"20.14","speaker_label":"spk_0","end_time":"20.24"},{"start_time":"20.24","speaker_label":"spk_0","end_time":"20.33"},{"start_time":"20.33","speaker_label":"spk_0","end_time":"20.53"},{"start_time":"20.53","speaker_label":"spk_0","end_time":"20.71"},{"start_time":"20.71","speaker_label":"spk_0","end_time":"21.25"},{"start_time":"21.7","speaker_label":"spk_0","end_time":"21.83"},{"start_time":"21.83","speaker_label":"spk_0","end_time":"21.99"},{"start_time":"21.99","speaker_label":"spk_0","end_time":"22.09"},{"start_time":"22.09","speaker_label":"spk_0","end_time":"22.27"},{"start_time":"22.27","speaker_label":"spk_0","end_time":"22.35"},{"start_time":"22.35","speaker_label":"spk_0","end_time":"22.45"},{"start_time":"22.45","speaker_label":"spk_0","end_time":"22.63"},{"start_time":"22.63","speaker_label":"spk_0","end_time":"23.01"},{"start_time":"23.01","speaker_label":"spk_0","end_time":"23.3"},{"start_time":"23.31","speaker_label":"spk_0","end_time":"23.4"},{"start_time":"23.4","speaker_label":"spk_0","end_time":"23.81"},{"start_time":"23.82","speaker_label":"spk_0","end_time":"24.42"},{"start_time":"24.42","speaker_label":"spk_0","end_time":"24.52"},{"start_time":"24.52","speaker_label":"spk_0","end_time":"24.93"},{"start_time":"24.93","speaker_label":"spk_0","end_time":"25.07"},{"start_time":"25.07","speaker_label":"spk_0","end_time":"25.15"},{"start_time":"25.15","speaker_label":"spk_0","end_time":"25.55"}]}]},"items":[{"start_time":"0.04","end_time":"0.54","alternatives":[{"confidence":"0.914","content":"Hello"}],"type":"pronunciation"},{"alternatives":[{"confidence":"0.0","content":","}],"type":"punctuation"},{"start_time":"0.54","end_time":"0.96","alternatives":[{"confidence":"1.0","content":"everyone"}],"type":"pronunciation"},{"alternatives":[{"confidence":"0.0","content":"."}],"type":"punctuation"},{"start_time":"0.96","end_time":"1.24","alternatives":[{"confidence":"1.0","content":"Thank"}],"type":"pronunciation"},{"start_time":"1.24","end_time":"1.32","alternatives":[{"confidence":"1.0","content":"you"}],"type":"pronunciation"},{"start_time":"1.32","end_time":"1.6","alternatives":[{"confidence":"1.0","content":"guys"}],"type":"pronunciation"},{"start_time":"1.6","end_time":"1.75","alternatives":[{"confidence":"1.0","content":"for"}],"type":"pronunciation"},{"start_time":"1.75","end_time":"2.22","alternatives":[{"confidence":"1.0","content":"coming"}],"type":"pronunciation"},{"start_time":"2.22","end_time":"2.31","alternatives":[{"confidence":"1.0","content":"to"}],"type":"pronunciation"},{"start_time":"2.31","end_time":"2.45","alternatives":[{"confidence":"1.0","content":"our"}],"type":"pronunciation"},{"start_time":"2.45","end_time":"2.87","alternatives":[{"confidence":"1.0","content":"weekly"}],"type":"pronunciation"},{"start_time":"2.87","end_time":"3.3","alternatives":[{"confidence":"0.632","content":"student"}],"type":"pronunciation"},{"start_time":"3.3","end_time":"3.78","alternatives":[{"confidence":"0.667","content":"success"}],"type":"pronunciation"},{"start_time":"3.78","end_time":"4.33","alternatives":[{"confidence":"1.0","content":"meeting"}],"type":"pronunciation"},{"alternatives":[{"confidence":"0.0","content":"."}],"type":"punctuation"},{"start_time":"4.66","end_time":"5.11","alternatives":[{"confidence":"0.968","content":"Um"}],"type":"pronunciation"},{"alternatives":[{"confidence":"0.0","content":","}],"type":"punctuation"},{"start_time":"5.11","end_time":"5.34","alternatives":[{"confidence":"1.0","content":"and"}],"type":"pronunciation"},{"start_time":"5.34","end_time":"5.52","alternatives":[{"confidence":"0.998","content":"let's"}],"type":"pronunciation"},{"start_time":"5.52","end_time":"5.69","alternatives":[{"confidence":"1.0","content":"just"}],"type":"pronunciation"},{"start_time":"5.69","end_time":"5.84","alternatives":[{"confidence":"1.0","content":"get"}],"type":"pronunciation"},{"start_time":"5.84","end_time":"6.32","alternatives":[{"confidence":"1.0","content":"started"}],"type":"pronunciation"},{"alternatives":[{"confidence":"0.0","content":"."}],"type":"punctuation"},{"start_time":"6.46","end_time":"6.74","alternatives":[{"confidence":"1.0","content":"So"}],"type":"pronunciation"},{"start_time":"6.74","end_time":"6.8","alternatives":[{"confidence":"1.0","content":"I"}],"type":"pronunciation"},{"start_time":"6.8","end_time":"7.0","alternatives":[{"confidence":"1.0","content":"have"}],"type":"pronunciation"},{"start_time":"7.0","end_time":"7.12","alternatives":[{"confidence":"0.97","content":"our"}],"type":"pronunciation"},{"start_time":"7.12","end_time":"7.41","alternatives":[{"confidence":"0.985","content":"list"}],"type":"pronunciation"},{"start_time":"7.41","end_time":"7.54","alternatives":[{"confidence":"1.0","content":"of"}],"type":"pronunciation"},{"start_time":"7.54","end_time":"8.01","alternatives":[{"confidence":"1.0","content":"chronically"}],"type":"pronunciation"},{"start_time":"8.01","end_time":"8.38","alternatives":[{"confidence":"0.985","content":"absent"}],"type":"pronunciation"},{"start_time":"8.38","end_time":"8.8","alternatives":[{"confidence":"1.0","content":"students"}],"type":"pronunciation"},{"start_time":"8.8","end_time":"9.21","alternatives":[{"confidence":"1.0","content":"here"}],"type":"pronunciation"},{"alternatives":[{"confidence":"0.0","content":","}],"type":"punctuation"},{"start_time":"9.22","end_time":"9.79","alternatives":[{"confidence":"1.0","content":"and"}],"type":"pronunciation"},{"start_time":"9.79","end_time":"9.9","alternatives":[{"confidence":"0.995","content":"I've"}],"type":"pronunciation"},{"start_time":"9.9","end_time":"10.01","alternatives":[{"confidence":"1.0","content":"been"}],"type":"pronunciation"},{"start_time":"10.01","end_time":"10.41","alternatives":[{"confidence":"1.0","content":"noticing"}],"type":"pronunciation"},{"start_time":"10.41","end_time":"10.47","alternatives":[{"confidence":"1.0","content":"a"}],"type":"pronunciation"},{"start_time":"10.47","end_time":"11.03","alternatives":[{"confidence":"0.984","content":"troubling"}],"type":"pronunciation"},{"start_time":"11.03","end_time":"11.75","alternatives":[{"confidence":"1.0","content":"trend"}],"type":"pronunciation"},{"alternatives":[{"confidence":"0.0","content":"."}],"type":"punctuation"},{"start_time":"12.14","end_time":"12.6","alternatives":[{"confidence":"0.921","content":"Ah"}],"type":"pronunciation"},{"alternatives":[{"confidence":"0.0","content":","}],"type":"punctuation"},{"start_time":"12.6","end_time":"12.78","alternatives":[{"confidence":"1.0","content":"lot"}],"type":"pronunciation"},{"start_time":"12.78","end_time":"12.86","alternatives":[{"confidence":"1.0","content":"of"}],"type":"pronunciation"},{"start_time":"12.86","end_time":"13.23","alternatives":[{"confidence":"1.0","content":"students"}],"type":"pronunciation"},{"start_time":"13.23","end_time":"13.3","alternatives":[{"confidence":"0.513","content":"are"}],"type":"pronunciation"},{"start_time":"13.3","end_time":"13.75","alternatives":[{"confidence":"1.0","content":"skipping"}],"type":"pronunciation"},{"start_time":"13.75","end_time":"13.9","alternatives":[{"confidence":"1.0","content":"on"}],"type":"pronunciation"},{"start_time":"13.9","end_time":"14.56","alternatives":[{"confidence":"0.771","content":"Fridays"}],"type":"pronunciation"},{"alternatives":[{"confidence":"0.0","content":"."}],"type":"punctuation"},{"start_time":"14.56","end_time":"14.81","alternatives":[{"confidence":"1.0","content":"Does"}],"type":"pronunciation"},{"start_time":"14.81","end_time":"15.17","alternatives":[{"confidence":"1.0","content":"anyone"}],"type":"pronunciation"},{"start_time":"15.17","end_time":"15.38","alternatives":[{"confidence":"1.0","content":"have"}],"type":"pronunciation"},{"start_time":"15.38","end_time":"15.58","alternatives":[{"confidence":"1.0","content":"any"}],"type":"pronunciation"},{"start_time":"15.58","end_time":"15.82","alternatives":[{"confidence":"1.0","content":"idea"}],"type":"pronunciation"},{"start_time":"15.82","end_time":"15.99","alternatives":[{"confidence":"0.998","content":"what's"}],"type":"pronunciation"},{"start_time":"15.99","end_time":"16.25","alternatives":[{"confidence":"1.0","content":"going"}],"type":"pronunciation"},{"start_time":"16.25","end_time":"16.55","alternatives":[{"confidence":"1.0","content":"on"}],"type":"pronunciation"},{"alternatives":[{"confidence":"0.0","content":"?"}],"type":"punctuation"},{"start_time":"17.25","end_time":"17.4","alternatives":[{"confidence":"0.99","content":"I've"}],"type":"pronunciation"},{"start_time":"17.4","end_time":"17.57","alternatives":[{"confidence":"1.0","content":"heard"}],"type":"pronunciation"},{"start_time":"17.57","end_time":"17.68","alternatives":[{"confidence":"1.0","content":"some"}],"type":"pronunciation"},{"start_time":"17.68","end_time":"17.77","alternatives":[{"confidence":"1.0","content":"of"}],"type":"pronunciation"},{"start_time":"17.77","end_time":"17.88","alternatives":[{"confidence":"1.0","content":"my"}],"type":"pronunciation"},{"start_time":"17.88","end_time":"18.35","alternatives":[{"confidence":"0.347","content":"mentees"}],"type":"pronunciation"},{"start_time":"18.35","end_time":"18.67","alternatives":[{"confidence":"0.999","content":"talking"}],"type":"pronunciation"},{"start_time":"18.67","end_time":"18.93","alternatives":[{"confidence":"0.999","content":"about"}],"type":"pronunciation"},{"start_time":"18.93","end_time":"19.2","alternatives":[{"confidence":"1.0","content":"how"}],"type":"pronunciation"},{"start_time":"19.2","end_time":"19.41","alternatives":[{"confidence":"0.998","content":"it's"}],"type":"pronunciation"},{"start_time":"19.41","end_time":"19.69","alternatives":[{"confidence":"0.496","content":"really"}],"type":"pronunciation"},{"start_time":"19.69","end_time":"19.95","alternatives":[{"confidence":"1.0","content":"hard"}],"type":"pronunciation"},{"start_time":"19.95","end_time":"20.02","alternatives":[{"confidence":"1.0","content":"to"}],"type":"pronunciation"},{"start_time":"20.02","end_time":"20.14","alternatives":[{"confidence":"1.0","content":"get"}],"type":"pronunciation"},{"start_time":"20.14","end_time":"20.24","alternatives":[{"confidence":"1.0","content":"out"}],"type":"pronunciation"},{"start_time":"20.24","end_time":"20.33","alternatives":[{"confidence":"1.0","content":"of"}],"type":"pronunciation"},{"start_time":"20.33","end_time":"20.53","alternatives":[{"confidence":"1.0","content":"bed"}],"type":"pronunciation"},{"start_time":"20.53","end_time":"20.71","alternatives":[{"confidence":"1.0","content":"on"}],"type":"pronunciation"},{"start_time":"20.71","end_time":"21.25","alternatives":[{"confidence":"0.988","content":"Fridays"}],"type":"pronunciation"},{"alternatives":[{"confidence":"0.0","content":"."}],"type":"punctuation"},{"start_time":"21.7","end_time":"21.83","alternatives":[{"confidence":"1.0","content":"It"}],"type":"pronunciation"},{"start_time":"21.83","end_time":"21.99","alternatives":[{"confidence":"1.0","content":"might"}],"type":"pronunciation"},{"start_time":"21.99","end_time":"22.09","alternatives":[{"confidence":"1.0","content":"be"}],"type":"pronunciation"},{"start_time":"22.09","end_time":"22.27","alternatives":[{"confidence":"1.0","content":"good"}],"type":"pronunciation"},{"start_time":"22.27","end_time":"22.35","alternatives":[{"confidence":"1.0","content":"if"}],"type":"pronunciation"},{"start_time":"22.35","end_time":"22.45","alternatives":[{"confidence":"1.0","content":"we"}],"type":"pronunciation"},{"start_time":"22.45","end_time":"22.63","alternatives":[{"confidence":"1.0","content":"did"}],"type":"pronunciation"},{"start_time":"22.63","end_time":"23.01","alternatives":[{"confidence":"1.0","content":"something"}],"type":"pronunciation"},{"start_time":"23.01","end_time":"23.3","alternatives":[{"confidence":"1.0","content":"like"}],"type":"pronunciation"},{"start_time":"23.31","end_time":"23.4","alternatives":[{"confidence":"1.0","content":"a"}],"type":"pronunciation"},{"start_time":"23.4","end_time":"23.81","alternatives":[{"confidence":"1.0","content":"pancake"}],"type":"pronunciation"},{"start_time":"23.82","end_time":"24.42","alternatives":[{"confidence":"1.0","content":"breakfast"}],"type":"pronunciation"},{"start_time":"24.42","end_time":"24.52","alternatives":[{"confidence":"0.997","content":"to"}],"type":"pronunciation"},{"start_time":"24.52","end_time":"24.93","alternatives":[{"confidence":"1.0","content":"encourage"}],"type":"pronunciation"},{"start_time":"24.93","end_time":"25.07","alternatives":[{"confidence":"1.0","content":"them"}],"type":"pronunciation"},{"start_time":"25.07","end_time":"25.15","alternatives":[{"confidence":"1.0","content":"to"}],"type":"pronunciation"},{"start_time":"25.15","end_time":"25.55","alternatives":[{"confidence":"1.0","content":"come"}],"type":"pronunciation"},{"alternatives":[{"confidence":"0.0","content":"."}],"type":"punctuation"}]},"status":"COMPLETED"};

        // data cleaning
        var items = data["results"].items
        // sorting items on basis of start time.
        items = items.sort(function(a,b) {
            var n = a["start_time"] - b["start_time"];
            if(n == 0) {
                n = a["end_time"] - b["end_time"];
            }
            return n;
        })

        // preprocessing: adding punctuation words to pronunciation words
        for(var i = 1; i < items.length;i++){
            if(items[i].type == "punctuation" && items[i-1].type == "pronunciation") {
                var word = items[i-1]["alternatives"][0].content
                var punctuation = items[i]["alternatives"][0].content
                items[i-1]["alternatives"][0].content += punctuation
            }
        }

        // preprocessing done. Final list
        var filtered_items = items.filter(function(item){
            return item.type == "pronunciation"
        } )

        // two pointer interval merge algorithm.
        // if obj a's end time is same as obj b's start time they are put in one clubbed sentences.
        // we make as many clubbed sentences as possible here

        var left = 0;
        var right = 1;

        var clubbedSentences = []

        while(right < filtered_items.length){
            var temp = [filtered_items[left]];
            while(left < filtered_items.length &&
            right < filtered_items.length &&
            filtered_items[right]["start_time"] <= filtered_items[left]["end_time"]){
                temp.push(filtered_items[right]);
                left++;
                right++;
            }
            clubbedSentences.push(temp);
            left = right;
            right = right + 1;
        }

        // we need to show each clubbed sentence as one line in the html
        // we make an div out of each one

        var s = ""
        for(var i = 0;i < clubbedSentences.length;i++){
            var start_time = clubbedSentences[i][0].start_time;
            var end_time = clubbedSentences[i][clubbedSentences[i].length-1].end_time;

            s += "<div>"
            var clubbedSentence = club(clubbedSentences[i])
            s += clubbedSentence
            s += "</div>"
        }

        // make interval tree out of each word so each word can be highlighted instead of
        // one sentence
        var clubbedIntervals = [];
        for(var i = 0;i <filtered_items.length;i++){
            var start_time = filtered_items[i].start_time
            var end_time = filtered_items[i].end_time
            clubbedIntervals.push({start: Number(start_time), end: Number(end_time), data: {color: "club" }});
        }

        // construct tree
        tree = new IntervalTree(clubbedIntervals);
        $('#subtitle-area').html(s)
        const divs = document.querySelectorAll('.testclass');
        divs.forEach(el => el.addEventListener('click', object => {
            var time = object.target.id.split(/[start|end]/);
            var filtered = time.filter(function (el) {
                return el != "";
            });
            document.getElementById("video-active").currentTime = Math.abs(Math.floor(Number(filtered[0])))
        }));


        var search_query = $("#search-query").data("text").toLowerCase()
        if(search_query.length > 0){
            var classitems = $('.testclass')
            var count = 0;
            for (var i = 0; i < classitems.length; i++) {
                var lowercase = classitems[i].innerHTML.toLowerCase()
                if(lowercase.indexOf(search_query) != -1){
                    count++;
                   id = classitems[i].id
                    x = document.getElementById(id).style.color= "#ff0000";
                }
            }

            $('#search-query').html(count)
        }



    }).catch(function(err) {
        // Run this when promise was rejected via reject()
    });
})

// gets a clubbed sentence, picks up individual intervals and assigns each of them
// a unique id, plus an onclick function to take it to the interval time
function club(data){
    var s = ""
    for(var i=0;i<data.length;i++){
        s += "<div class=testclass style=display:inline-block;margin-right:5px;cursor:pointer; id=start-"+data[i].start_time+"end-"+data[i].end_time+">" + data[i]["alternatives"][0].content +" </div>"
    }

    return s;
}

// when clicked on a word, takes to a particular time frame
function takeToTime(object){
    var time = object.id.split(/[start|end]/);
    var filtered = time.filter(function (el) {
        return el != "";
    });
    document.getElementById("video-active").currentTime = Math.abs(Math.floor(Number(filtered[0])))
}
// syncs with the audio playing wrt time and queries interval tree to find the
// appropriate id of the element
function onTrackedVideoFrame(currentTime, duration){
    var newDuration = currentTime.toFixed(3)
    node = tree.queryPoint(Number(newDuration))
    lightUp(node[0])
//    lightUp(tree.queryPoint(Number(newDuration)))
    $("#current").text(newDuration); //Change #current to currentTime
    $("#duration").text(duration.toFixed(2))
}
// changes color of an item with red
function lightUp(node){
    if(node != undefined){
        var startTime = node.start;
        var endTime = node.end;
        var str = String(startTime)
        var end = String(endTime)
        if(str.indexOf(".") == -1) {
            startTime = startTime.toFixed(1);
        }

        if(end.indexOf(".") == -1) {
            endTime = endTime.toFixed(1);
        }

        var element = document.getElementById('start-'+startTime+'end-'+endTime+'')
        if(element != undefined) {
            element.style.color = "#ff0000";
        }

    }

}
