import { DEBUG } from 'internal:constants';
import { approx, assertIsTrue } from '../../../../core';
import { MotionSyncInfo } from './motion-sync-info';

export class RuntimeMotionSyncManager {
    public register (syncInfo: MotionSyncInfo): RuntimeMotionSyncRecord {
        const {
            group: groupName,
        } = syncInfo;
        let group = this._groups.find((group) => group.name === groupName);
        if (!group) {
            group = new Group(groupName);
            this._groups.push(group);
        }
        return group.addMember();
    }

    public sync (): void {
        for (const group of this._groups) {
            group.sync();
        }
    }

    private _groups: Group[] = [];
}

class Group {
    constructor (public readonly name: string) {
    }

    public addMember (): RuntimeMotionSyncRecordImpl {
        const record = new RuntimeMotionSyncRecordImpl();
        this._records.push(record);
        return record;
    }

    public sync (): void {
        const {
            _records: records,
        } = this;
        const nRecords = records.length;
        assertIsTrue(nRecords > 0);

        const { _lastLeader: lastLeader } = this;
        this._lastLeader = undefined;

        // Do nothing if all of records are inactive.
        if (records.every((r) => !r.active)) {
            return;
        }

        // Sort records so that higher weighted records are in front,
        // inactive records are treated having weight -1.
        records.sort((a, b) => {
            const kA = a.active ? a.weight : -1.0;
            const kB = b.active ? b.weight : -1.0;
            return kB - kA;
        });

        // Assertion: inactive records are in tail.
        if (DEBUG) {
            const firstInactiveRecord = records.findIndex((r) => !r.active);
            assertIsTrue((firstInactiveRecord < 0 ? [] : records.slice(firstInactiveRecord))
                .every((r) => !r.active));
        }

        // Here's an optimization:
        // if two or more records have almost same weight. Their order is indeterminate.
        // To avoid this, we prefer the leader during previous sync.
        let leaderIndex = 0;
        const leaderWeight = records[0].weight;
        // If the first record is just the last leader, everyone is happy, nothing to do.
        if (records[leaderIndex] !== lastLeader) {
            for (let iRecord = 0; iRecord < nRecords; ++iRecord) {
                const record = records[iRecord];
                if (!record.active || !approx(record.weight, leaderWeight, 1e-6)) {
                    break;
                }
                if (record === lastLeader) {
                    leaderIndex = iRecord;
                    break;
                }
            }
        }

        // Assertion: the first record is active. It becomes the leader.
        assertIsTrue(records[leaderIndex].active);

        this._lastLeader = records[leaderIndex];

        // Sync followers to follow the leader.
        const leaderNormalizedTime = records[leaderIndex].normalizedTime;
        for (let iRecord = 0; iRecord < nRecords; ++iRecord) {
            const record = records[iRecord];
            if (!record.active) {
                break;
            }
            record.normalizedTime = leaderNormalizedTime;
            record.reset();
        }
    }

    private _lastLeader: RuntimeMotionSyncRecordImpl | undefined = undefined;
    private _records: RuntimeMotionSyncRecordImpl[] = [];
}

class RuntimeMotionSyncRecordImpl implements RuntimeMotionSyncRecord {
    public notifyRenter (normalizedTime: number): void {
        this.reset();
        this.normalizedTime = normalizedTime;
    }

    public notifyUpdate (normalizedDeltaTime: number, weight: number): void {
        this.normalizedTime += normalizedDeltaTime;
        // Note: we're allowing update multiple times. The first update becomes "activate".
        if (this.active) {
            this.weight += weight;
        } else {
            this.active = true;
            this.weight = weight;
        }
    }

    public reset (): void {
        this.active = false;
        this.weight = 0.0;
    }

    public normalizedTime = 0.0;

    public weight = 0.0;

    public active = false;

    public getSyncedEnterTime (): number {
        return this.normalizedTime;
    }
}

export interface RuntimeMotionSyncRecord {
    notifyRenter(normalizedTime: number): void;

    notifyUpdate(deltaTime: number, weight: number): void;

    getSyncedEnterTime(): number;
}
